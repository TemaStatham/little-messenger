package repository

import (
	"fmt"

	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/jmoiron/sqlx"
)

// ChatPostgres :
type ChatPostgres struct {
	db *sqlx.DB
}

// NewChatPostgres :
func NewChatPostgres(db *sqlx.DB) *ChatPostgres {
	return &ChatPostgres{db: db}
}

// GetConversation - метод получения беседы из бд
func (r *ChatPostgres) GetConversation(name string) (conv *models.Conversation, err error) {
	query := `
        SELECT c.id, c.name, c.created_at, u.id as user_id, u.username, u.first_name, u.last_name, u.email, u.photo_id, u.path,
               cm.entry_at, cm.release_at,
               m.content, m.send_time
        FROM chats c
        LEFT JOIN conversation_members cm ON c.id = cm.chat_id
        LEFT JOIN users u ON cm.user_id = u.id
        LEFT JOIN messages m ON c.id = m.chat_id
        WHERE c.name = $1
    `

	err = r.db.Get(&conv, query, name)
	if err != nil {
		return nil, fmt.Errorf("error getting conversation: %v", err)
	}

	return conv, nil
}

// GetMessage -
func (r *ChatPostgres) GetMessage(messId uint) (*models.Message, error) {
	query := `
        SELECT m.id, m.content, m.send_time 
        FROM messages m
        WHERE m.id = $1
    `

	var message *models.Message

	err := r.db.Select(&message, query, messId)
	if err != nil {
		return nil, fmt.Errorf("error getting message: %v", err)
	}

	return message, nil
}

// GetMessages - метод получения сообщений беседы из базы данных.
func (r *ChatPostgres) GetMessages(convID uint) ([]*models.Message, error) {
	query := `
        SELECT m.content, m.send_time, u.id, u.username, u.first_name, u.last_name, u.email, u.photo_id, u.path
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.chat_id = $1
    `

	var messages []*models.Message

	err := r.db.Select(&messages, query, convID)
	if err != nil {
		return nil, fmt.Errorf("error getting messages: %v", err)
	}

	return messages, nil
}

// GetConversationMember - метод для получения участников беседы из базы данных.
func (r *ChatPostgres) GetConversationMember(convID uint) ([]*models.ConversationMember, error) {
	query := `
        SELECT u.id, u.username, u.first_name, u.last_name, u.email, u.photo_id, u.path
        FROM conversation_members cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.chat_id = $1
    `

	var members []*models.ConversationMember

	err := r.db.Select(&members, query, convID)
	if err != nil {
		return nil, fmt.Errorf("error getting conversation members: %v", err)
	}

	return members, nil
}
