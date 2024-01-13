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
		INSERT INTO public_chats (name, creation_date, creator_user_id, chat_id, img)
		VALUES ($1, CURRENT_DATE, $2, $3, 'http://localhost:8080/images/chat.png')
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

// CreateMessage создаем сообщение вбазе данных
func (c *ChatPostgres) CreateMessage(content string, userID, chatID uint) error {
	query := `
		INSERT INTO messages (content, user_id, chat_id, send_time)
		VALUES ($1, $2, $3, CURRENT_DATE)
	`

	_, err := c.db.Exec(query, content, userID, chatID)
	if err != nil {
		return fmt.Errorf("error creating message: %v", err)
	}

	return nil
}

// GetUserPublicChats получает публичные чаты, в которых участвует пользователь
func (c *ChatPostgres) GetUserPublicChats(userID uint) ([]models.Conversation, error) {
	query := `
        SELECT pc.chat_id as chat_id, pc.name as name, pc.creation_date as creation_date, pc.creator_user_id as creator_user_id, pc.img as img
        FROM public_chats pc
		JOIN chat_members cm ON cm.chat_id = pc.chat_id
        WHERE cm.user_id = $1
    `

	var userPublicChats []models.Conversation
	if err := c.db.Select(&userPublicChats, query, userID); err != nil {
		return nil, fmt.Errorf("error getting user public chats: %v", err)
	}

	return userPublicChats, nil
}

// GetUserPrivateChats получает личные чаты, в которых участвует пользователь
func (c *ChatPostgres) GetUserPrivateChats(userID uint) ([]models.Chat, error) {
	query := `
        SELECT pc.chat_id as chat_id, u2.id as user_id, u2.username as username, up.path as userphoto
        FROM private_chats pc
        JOIN users u1 ON pc.user1_id = u1.id
        JOIN users u2 ON pc.user2_id = u2.id
		JOIN user_photos up ON up.user_id = u2.id 
        WHERE u1.id = $1
    `

	var userPrivateChats []models.Chat
	if err := c.db.Select(&userPrivateChats, query, userID); err != nil {
		return nil, fmt.Errorf("error getting user private chats: %v", err)
	}

	return userPrivateChats, nil
}

// GetChatMessages получает сообщения для указанного чата
func (c *ChatPostgres) GetChatMessages(chatID uint) ([]models.Message, error) {
	query := `
        SELECT m.id, m.user_id, u.username as username, m.content as content, m.send_time as send_time
        FROM messages m
		JOIN users u ON u.id = m.user_id 
        WHERE m.chat_id = $1
		ORDER BY m.id
    `

	var messages []models.Message
	if err := c.db.Select(&messages, query, chatID); err != nil {
		return nil, fmt.Errorf("error getting chat messages: %v", err)
	}

	return messages, nil
}

// GetPubChatMembers изъять участников беседы
func (c *ChatPostgres) GetPubChatMembers(chatID uint) ([]models.Contact, error) {
	query := `
        SELECT u.id, u.username, u.email, u.first_name, u.last_name, up.path as image
        FROM public_chats pc
		JOIN chat_members cm ON cm.chat_id = pc.id
		JOIN users u ON u.id = cm.user_id 
		JOIN
			(
				SELECT
					user_id,
					path,
					ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY id DESC) AS row_num
				FROM
					user_photos
			) AS up ON u.id = up.user_id AND up.row_num = 1
        WHERE pc.id = $1
    `

	var members []models.Contact
	if err := c.db.Select(&members, query, chatID); err != nil {
		return nil, fmt.Errorf("error getting public chat members: %v", err)
	}

	return members, nil

}

func (c *ChatPostgres) GetPubChatMembersIDs(chatID uint) ([]uint, error) {
	query := `
        SELECT u.id
        FROM public_chats pc
		JOIN chat_members cm ON cm.chat_id = pc.id
		JOIN users u ON u.id = cm.user_id 
		JOIN
			(
				SELECT
					user_id,
					path,
					ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY id DESC) AS row_num
				FROM
					user_photos
			) AS up ON u.id = up.user_id AND up.row_num = 1
        WHERE pc.id = $1
    `

	var members []uint
	if err := c.db.Select(&members, query, chatID); err != nil {
		return nil, fmt.Errorf("error getting public chat members: %v", err)
	}

	return members, nil
}

func (c *ChatPostgres) ChangeImgPubChat(chatID uint, img string) error {
	query := `
		UPDATE public_chats
		SET img = $1
		WHERE id = $2
	`
	fmt.Println("asdasdasdasdasdasdasd\n\n\n\n\n\n")
	_, err := c.db.Exec(query, img, chatID)
	if err != nil {
		return fmt.Errorf("error updating public chat image: %v", err)
	}
	
	fmt.Println(2)
	return nil
}
