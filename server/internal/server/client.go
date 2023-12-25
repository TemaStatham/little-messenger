package server

import (
	"bytes"
	"encoding/json"
	"log"
	"time"

	"github.com/TemaStatham/Little-Messenger/internal/models"
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
		log.Printf("error unmarshalling JSON: %v", err)
		return
	}

	// userID, err := c.services.Authorization.ParseToken(parsedMessage.ClientID)
	// if err != nil {
	// 	log.Printf("%v", err)
	// 	return
	// }
	c.clientID = 1

	user, err := c.services.GetUserByID(c.clientID)
	if err != nil {
		log.Printf("%v", err)
		return
	}

	switch parsedMessage.Type {
	case "auth":
		chats, err := c.services.GetChats(c.clientID)
		if err != nil {
			log.Printf("%v", err)
			return
		}
		type content struct {
			User models.User   `json:"User"`
			Chat []models.Chat `json:"Chat"`
		}
		con := content{
			User: user,
			Chat: chats,
		}
		jsonData, err := json.Marshal(con)
		if err != nil {
			log.Println("Ошибка при маршалинге в JSON:", err)
			return
		}
		c.send <- jsonData
	case "send":
		break
	case "create chat":
		break
	case "add new contact":
		break
	default:
		log.Printf("Unknown message type: %s", parsedMessage.ClientID)
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
