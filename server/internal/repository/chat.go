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

func (r *ChatPostgres) GetChats(userID uint) (chats []models.Chat, err error) {
	query := `SELECT * FROM chats WHERE user1_id = $1 OR user2_id = $1`

	err = r.db.Raw(query, userID).Find(&chats).Error

	return
}

func (r *ChatPostgres) GetMessages(userID uint) (messages []models.Message, err error) {
	query := `
		SELECT *
		FROM messages
		WHERE sender_id = $1
	`

	err = r.db.Raw(query, userID).Find(&messages).Error
	
	return
}

func (r *ChatPostgres) CreateChat(firstUser *models.User, secondUser *models.User) (err error) {
	query := `INSERT INTO chats 
	(
		user1_id,
		user2_id,
	) VALUES ($1 $2)`

	err = r.db.Exec(query, firstUser.ID, secondUser.ID).Error

	return
}

func (r *ChatPostgres) CreateMessage() () {
	return
}
