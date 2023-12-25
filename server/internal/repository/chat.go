package repository

import (
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

func (r *ChatPostgres) GetChats(userID uint) (chats []models.Chat, err error) {
	//query := `SELECT * FROM chats WHERE user1_id = $1 OR user2_id = $1`

	err = nil

	return
}

func (r *ChatPostgres) GetMessages(userID uint) (messages []models.Message, err error) {
	// query := `
	// 	SELECT *
	// 	FROM messages
	// 	WHERE sender_id = $1
	// `

	err = nil

	return
}

func (r *ChatPostgres) CreateChat(firstUser *models.User, secondUser *models.User) (err error) {
	// query := `INSERT INTO chats
	// (
	// 	user1_id,
	// 	user2_id,
	// ) VALUES ($1 $2)`

	err = nil

	return
}

func (r *ChatPostgres) CreateMessage() {
	return
}
