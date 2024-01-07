package services

import (
	"github.com/TemaStatham/Little-Messenger/internal/repository"
)

// ChatService предоставляет методы для работы с чатами и беседами.
type ChatService struct {
	repo repository.Chat
}

// NewChatService создает новый экземпляр ChatService с предоставленным репозиторием чатов.
func NewChatService(repo repository.Chat) *ChatService {
	return &ChatService{repo: repo}
}

// CreatePublicChat создает общую беседу
func (c *ChatService) CreatePublicChat(creatorID uint, name string) error {
	return c.repo.CreatePublicChat(creatorID, name)
}

// CreatePrivateChat создает личные сообщения
func (c *ChatService) CreatePrivateChat(user1ID, user2ID uint) error {
	return c.repo.CreatePrivateChat(user1ID, user2ID)
}

// CreateChatMember добавляет пользователя к участникам публичной беседы
func (c *ChatService) CreateChatMember(userID, chatID uint) error {
	return c.repo.CreateChatMember(userID, chatID)
}

// // GetConversation возвращает беседу по ее имени.
// func (c *ChatService) GetConversation(name string) (conv *models.Conversation, err error) {
// 	return c.repo.GetConversation(name)
// }

// // GetConversationsByUserID возвращает все чаты, в которых участвует пользователь, по его идентификатору.
// func (c *ChatService) GetConversationsByUserID(userID uint) (chats []*models.Chat, err error) {
// 	return c.repo.GetConversationsByUserID(userID)
// }
