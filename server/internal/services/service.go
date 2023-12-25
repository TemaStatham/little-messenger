package services

import (
	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/TemaStatham/Little-Messenger/internal/repository"
)

type Authorization interface {
	CreateUser(user *models.User) error
	GetUserByID(userID uint) (models.User, error)
	GenerateToken(username, password string) (string, error)
	ParseToken(token string) (string, error)
}

type Chat interface {
	GetChats(userID uint) ([]models.Chat, error)
}

type WebSocket interface {
}

type Service struct {
	Authorization
	Chat
	WebSocket
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		Authorization: NewAuthService(repos.Authorization),
		Chat:          NewChatService(repos.Chat),
		WebSocket:     NewWebSocketService(repos.WebSocket),
	}
}
