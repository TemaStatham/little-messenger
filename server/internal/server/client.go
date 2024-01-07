package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/TemaStatham/Little-Messenger/internal/services"
	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

type Message struct {
	ClientID string `json:"clientID"`
	ChatID   string `json:"chatID"`
	Type     string `json:"type"`
	Content  string `json:"content"`
}

type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	send     chan []byte
	services *services.Service
	clientID uint
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))

		c.recognizeMessage(message)

	}
}

func (c *Client) recognizeMessage(message []byte) {
	var parsedMessage Message
	if err := json.Unmarshal(message, &parsedMessage); err != nil {
		log.Printf("error unmarshalling JSON: %v\n", err)
		return
	}

	userID, err := c.services.User.ParseToken(parsedMessage.ClientID)
	if err != nil {
		log.Printf("%v\n", err)
		return
	}
	c.clientID = userID
	fmt.Print(userID)
	switch parsedMessage.Type {
	case "auth":
		user, err := c.services.GetUserByID(c.clientID)
		if err != nil {
			log.Printf("%v\n", err)
			return
		}
		chats, err := c.services.GetChatsByUserID(userID)
		if err != nil {
			log.Printf("%v\n", err)
			return
		}
		conversations, err := c.services.GetConversationsByUserID(userID)
		if err != nil {
			log.Printf("%v\n", err)
			return
		}
		jsonData, err := json.Marshal(map[string]interface{}{
			"user":          user,
			"chats":         chats,
			"conversations": conversations,
		})
		if err != nil {
			log.Println("ошибка при маршалинге в JSON:", err)
			return
		}
		c.send <- jsonData
		break
	case "send":
		break
	case "create chat":
		user, err := c.services.GetUserByID(c.clientID)
		if err != nil {
			log.Printf("%v\n", err)
			return
		}
		err = c.services.CreatePublicChat(user.ID, parsedMessage.ChatID)
		if err != nil {
			log.Println(err.Error())
			return
		}
		jsonData, err := json.Marshal(map[string]interface{}{
			"user": user,
		})
		if err != nil {
			log.Println("ошибка при маршалинге в JSON:", err)
			return
		}
		c.send <- jsonData
		break
	case "get users":
		user, err := c.services.GetUserByID(c.clientID)
		if err != nil {
			log.Printf("%v\n", err)
			return
		}
		users, err := c.services.GetUsers()
		if err != nil {
			log.Println("error recognize messages get users: ", err)
			return
		}
		jsonData, err := json.Marshal(map[string]interface{}{
			"user":  user,
			"users": users,
		})
		if err != nil {
			log.Println("ошибка при маршалинге в JSON: ", err)
			return
		}
		c.send <- jsonData
		break
	case "create contact":
		err := c.services.CreateContact(strconv.FormatUint(uint64(userID), 10), parsedMessage.Content)
		if err != nil {
			log.Println("не удалось создать контакт: ", err)
			return
		}
		user, err := c.services.GetUserByID(c.clientID)
		if err != nil {
			log.Printf("%v\n", err)
			return
		}
		jsonData, err := json.Marshal(map[string]interface{}{
			"status": "contact create success",
			"user":   user,
		})
		if err != nil {
			log.Println("ошибка при маршалинге в JSON: ", err)
			return
		}
		c.send <- jsonData
		break
	default:
		log.Printf("unknown message type: %s", parsedMessage.ClientID)
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
