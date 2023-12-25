package repository

import (
	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/jmoiron/sqlx"
)

type WebSocketPostgres struct {
	db *sqlx.DB
}

func NewWebSocketPostgres(db *sqlx.DB) *WebSocketPostgres {
	return &WebSocketPostgres{db: db}
}

func (r *WebSocketPostgres) GetChats(userID uint) (chats models.Chat, err error) {
	//query := `SELECT * FROM chats WHERE user1_id = $1 OR user2_id = $1`

	err = nil

	return
}

func (r *WebSocketPostgres) GetMessages(userID uint) (messages []models.Message, err error) {
	return
}
