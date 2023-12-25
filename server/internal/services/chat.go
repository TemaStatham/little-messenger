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

func (c *ChatService) GetConversation(name string) (conv *models.Conversation, err error) {
	return c.repo.GetConversation(name)
}