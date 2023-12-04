package repository

import (
	"github.com/TemaStatham/Little-Messenger/internal/models"
	"gorm.io/gorm"
)

type ChatPostgres struct {
	db *gorm.DB
}

func NewChatPostgres(db *gorm.DB) *ChatPostgres {
	return &ChatPostgres{db: db}
}

func (r *ChatPostgres) GetChats(userID uint) (chats models.Chat, err error) {
	query := `SELECT * FROM chats WHERE user1_id = $1 OR user2_id = $1`

	err = r.db.Raw(query, userID).Scan(&chats).Error

	return
}
