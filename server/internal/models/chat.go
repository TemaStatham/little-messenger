package models

import "time"

// Conversation : беседа
type Conversation struct {
	ID        uint      `json:"chat_id" db:"chat_id"`
	Name      string    `json:"name" db:"name"`
	Creator   uint      `json:"creator" db:"creator_user_id"`
	CreatedAt time.Time `json:"createdAt" db:"creation_date"`
	Users     []Contact `json:"users" db:"-"`
	Messages  []Message `json:"messages" db:"-"`
}

// Chat : личные сообщения
type Chat struct {
	ID       uint      `json:"chat_id" db:"chat_id"`
	User1    Contact   `json:"user1" db:"-"`
	User2    Contact   `json:"user2" db:"-"`
	Messages []Message `json:"messages" db:"-"`
}

// Message : сообщение
type Message struct {
	ID       uint      `json:"id" db:"id"`
	Sender   Contact   `json:"sender" db:"-"`
	Content  string    `json:"content" db:"content"`
	SendTime time.Time `json:"sendTime" db:"send_time"`
}

