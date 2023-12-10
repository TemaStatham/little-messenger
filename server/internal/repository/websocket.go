package repository

import (
	"github.com/TemaStatham/Little-Messenger/internal/models"
	"gorm.io/gorm"
)

type WebSocketPostgres struct {
	db *gorm.DB
}

func NewWebSocketPostgres(db *gorm.DB) *WebSocketPostgres {
	return &WebSocketPostgres{db: db}
}

func (r *WebSocketPostgres) GetChats(userID uint) (chats models.Chat, err error) {
	query := `SELECT * FROM chats WHERE user1_id = $1 OR user2_id = $1`

	err = r.db.Raw(query, userID).Scan(&chats).Error

	return
}

func (r *WebSocketPostgres) GetMessages(userID uint) (messages []models.Message, err error) {
	return
}
