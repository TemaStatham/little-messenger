package server

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type WebSocketService interface {
	ServeWebSocket(ctx *gin.Context, hub *Hub)
}

type webSocketService struct {
	upgrader     websocket.Upgrader
	connections  map[uint]*websocket.Conn
	mu           sync.Mutex
	tokenService string
}

type Message struct {
	SenderID   uint   `json:"sender_id"` // will remove if its not necessary
	ChatID     uint   `json:"chat_id"`
	ReceiverID uint   `json:"receiver_id"`
	Content    string `json:"content"`
}

func NewWebSocketService(token string) WebSocketService {
	return &webSocketService{
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin:     func(r *http.Request) bool { return true },
		},
		connections:  make(map[uint]*websocket.Conn),
		mu:           sync.Mutex{},
		tokenService: token,
	}
}

func (c *webSocketService) ServeWebSocket(ctx *gin.Context, hub *Hub) {
	socketConn, err := c.upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		log.Println("failed to upgrade connection")
		return
	}

	client := &Client{hub: hub, conn: socketConn, send: make(chan []byte, 256)}
	client.hub.register <- client

	go client.writePump()
	go client.readPump()
}
