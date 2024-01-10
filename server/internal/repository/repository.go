package repository

import (
	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/jmoiron/sqlx"
)

// User - интерфейс для взаимодействия с данными пользователей в базе данных.
type User interface {
	CreateUser(user *models.User) (uint, error)
	CreateUserPhoto(userID uint, imageURLs []string) error
	CreateContact(user1ID, user2ID string) error

	GetUserByEmail(email, password string) (models.User, error)
	GetUserByID(userID uint) (models.User, error)

	GetUsers() ([]models.Contact, error)

	GetUserPhotosByUserID(userID uint) ([]string, error)
	GetContactsIDsByUserID(userID uint) ([]uint, error)
	GetContactsByUserID(userID uint) ([]models.Contact, error)
}

// Chat - интерфейс для взаимодействия с данными бесед и сообщений в базе данных.
type Chat interface {
	CreatePublicChat(creatorID uint, name string) error
	CreatePrivateChat(user1ID, user2ID uint) error
	CreateChatMember(userID, chatID uint) error
	CreateMessage(content string, userID, chatID uint) error

	GetUserPublicChats(userID uint) ([]models.Conversation, error)
	GetUserPrivateChats(userID uint) ([]models.Chat, error)
	GetChatMessages(chatID uint) ([]models.Message, error)
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
