package models

import "time"

// Conversation : беседа
type Conversation struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Creator   User      `json:"creator"`
	CreatedAt time.Time `json:"createdAt"`
	Users     []User    `json:"users"`
	Messages  []Message `json:"messages"`
}

// Chat : личные сообщения
type Chat struct {
	ID       uint      `json:"id"`
	User1    User      `json:"user1"`
	User2    User      `json:"user2"`
	Messages []Message `json:"messages"`
}

// Message : сообщение
type Message struct {
	ID       uint      `json:"id"`
	Sender   User      `json:"sender"`
	Content  string    `json:"content"`
	SendTime time.Time `json:"sendTime"`
}
