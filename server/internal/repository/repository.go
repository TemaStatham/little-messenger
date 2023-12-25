package repository

import (
	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/jmoiron/sqlx"
)

// User - интерфейс для взаимодействия с данными пользователей в базе данных.
type User interface {
	CreateUser(user *models.User) (uint, error)
	CreateUserPhoto(userID uint, imageURLs []string) error
	CreateContact(user1ID, user2ID uint) (contactID int, err error)
	GetUser(email, password string) (user *models.User, err error)
	GetUserByID(userID uint) (user *models.User, err error)
	GetUserPhotosByUserID(userID uint) ([]string, error)
	GetContactsIDsByUserID(userID uint) ([]uint, error)
	GetContactsByUserID(userID uint) ([]*models.User, error)
}

// Chat - интерфейс для взаимодействия с данными бесед и сообщений в базе данных.
type Chat interface {
	GetConversation(name string) (conv *models.Conversation, err error)
	GetMessages(convID uint) ([]*models.Message, error)
	GetConversationMember(convID uint) ([]*models.ConversationMember, error)
}

// Repository - структура, объединяющая различные репозитории для работы с данными.
type Repository struct {
	User
	Chat
}

// NewRepository - конструктор для создания нового экземпляра Repository.
func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		User: NewUserPostgres(db),
		Chat: NewChatPostgres(db),
	}
}
