package repository

import (
	"fmt"

	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/jmoiron/sqlx"
)

const (
	publicTypeName  = "public"
	privateTypeName = "private"
)

// ChatPostgres :
type ChatPostgres struct {
	db *sqlx.DB
}

// NewChatPostgres :
func NewChatPostgres(db *sqlx.DB) *ChatPostgres {
	return &ChatPostgres{db: db}
}

// CreatePublicChat создает общую беседу
func (c *ChatPostgres) CreatePublicChat(creatorID uint, name string) error {
	chatID, err := c.CreateChat(publicTypeName)
	if err != nil {
		return fmt.Errorf("error creating public chat: %v", err)
	}

	query := `
		INSERT INTO public_chats (name, creation_date, creator_user_id, chat_id)
		VALUES ($1, CURRENT_DATE, $2, $3)
	`
	_, err = c.db.Exec(query, name, creatorID, chatID)
	if err != nil {
		return fmt.Errorf("error creating public chat: %v", err)
	}

	err = c.CreateChatMember(creatorID, chatID)
	if err != nil {
		return fmt.Errorf("error creating public chat: %v", err)
	}

	return nil
}

// CreatePrivateChat создает личные сообщения
func (c *ChatPostgres) CreatePrivateChat(user1ID, user2ID uint) error {
	chatID, err := c.CreateChat(privateTypeName)
	if err != nil {
		return fmt.Errorf("error creating private chat: %v", err)
	}

	query := `
		INSERT INTO private_chats (user1_id, user2_id, chat_id)
		VALUES ($1, $2, $3)
	`
	_, err = c.db.Exec(query, user1ID, user2ID, chatID)
	if err != nil {
		return fmt.Errorf("error creating private chat: %v", err)
	}

	return nil
}

// CreateChat создает общий чат в таблице chats
func (c *ChatPostgres) CreateChat(chatType string) (uint, error) {
	query := `
		INSERT INTO chats (type_name)
		VALUES ($1)
		RETURNING id
	`

	var chatID uint
	err := c.db.Get(&chatID, query, chatType)
	if err != nil {
		return 0, fmt.Errorf("error creating chat: %v", err)
	}

	return chatID, nil
}

// CreateChatMember добавляет пользователя к участникам публичной беседы
func (c *ChatPostgres) CreateChatMember(userID, chatID uint) error {
	query := `
		INSERT INTO chat_members (user_id, chat_id)
		VALUES ($1, $2)
	`
	_, err := c.db.Exec(query, userID, chatID)
	if err != nil {
		return fmt.Errorf("error create chat member: %v", err)
	}

	return nil
}

// GetPublicChats получить публичные чаты
func (c *ChatPostgres) GetPublicChats() ([]models.Chat, error) {
	query := `
        SELECT pc.id, pc.name, pc.creation_date, pc.creator_user_id
        FROM public_chats pc
    `
	var publicChats []models.Chat
	if err := c.db.Select(&publicChats, query); err != nil {
		return nil, fmt.Errorf("error getting public chats: %v", err)
	}
	return publicChats, nil
}
