package repository

import (
	"github.com/TemaStatham/Little-Messenger/internal/models"
	"gorm.io/gorm"
)

type Authorization interface {
	CreateUser(user *models.User) error
	GetUser(username, password string) (user models.User, err error)
	GetUserByID(userID uint) (user models.User, err error)
}

type Chat interface {
	GetChats(userID uint) (chats []models.Chat, err error)
	GetMessages(userID uint) (messages []models.Message, err error)
	CreateChat(firstUser *models.User, secondUser *models.User) (err error)
	CreateMessage() ()
}

type WebSocket interface {
	GetChats(userID uint) (chats models.Chat, err error)
	GetMessages(userID uint) (messages []models.Message, err error)
}

type Repository struct {
	Authorization
	Chat
	WebSocket
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{
		Authorization: NewAuthPostgres(db),
		Chat:          NewChatPostgres(db),
		WebSocket:     NewWebSocketPostgres(db),
	}
}
