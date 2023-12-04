package services

import "github.com/TemaStatham/Little-Messenger/internal/repository"

type WebSocketService struct {
	repo repository.WebSocket
}

func NewWebSocketService(repo repository.WebSocket) *WebSocketService {
	return &WebSocketService{repo: repo}
}