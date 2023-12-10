package services

import (
	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/TemaStatham/Little-Messenger/internal/repository"
)

type ChatService struct {
	repo repository.Chat
}

func NewChatService(repo repository.Chat) *ChatService {
	return &ChatService{repo: repo}
}

func (c *ChatService) GetChats(userID uint) ([]models.Chat, error) {
	return c.repo.GetChats(userID)
}
