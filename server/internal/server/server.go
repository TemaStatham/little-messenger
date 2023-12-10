package server

import (
	"github.com/TemaStatham/Little-Messenger/internal/services"
	"github.com/gin-gonic/gin"
)

type WebSocketService interface {
	ServeWebSocket(ctx *gin.Context, hub *Hub)
}

type WebSocket struct {
	WebSocketService
}

func NewWebSocket(services *services.Service) *WebSocket {
	return &WebSocket{
		WebSocketService: newWebSocketService(services),
	}
}
