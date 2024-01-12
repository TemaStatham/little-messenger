package models

import "time"

// Conversation : беседа
type Conversation struct {
	ID        uint      `json:"chatID" db:"chat_id"`
	Name      string    `json:"name" db:"name"`
	Img       string    `json:"photo" db:"img"`
	Creator   uint      `json:"creator" db:"creator_user_id"`
	CreatedAt time.Time `json:"createdAt" db:"creation_date"`
	Users     []Contact `json:"users" db:"-"`
	Messages  []Message `json:"messages" db:"-"`
}

// Chat : личные сообщения
type Chat struct {
	ID        uint      `json:"chatID" db:"chat_id"`
	UserID    uint      `json:"userID" db:"user_id"`
	Username  string    `json:"username" db:"username"`
	Userphoto string    `json:"userphoto" db:"userphoto"`
	Messages  []Message `json:"messages" db:"-"`
}

// Message : сообщение
type Message struct {
	ID        uint      `json:"id" db:"id"`
	UserID    uint      `json:"userID" db:"user_id"`
	Username  string    `json:"username" db:"username"`
	UserPhoto string    `json:"userPhoto" db:"photo"`
	Content   string    `json:"content" db:"content"`
	SendTime  time.Time `json:"sendTime" db:"send_time"`
}
