package models

import "time"

// Conversation : беседа
type Conversation struct {
	ID        uint                  `json:"id"`
	Name      string                `json:"name"`
	CreatedAt time.Time             `json:"createdAt"`
	Users     []*ConversationMember `json:"users"`
	Messages  []*Message            `json:"messages"`
}

// ConversationMember : участник беседы
type ConversationMember struct {
	User      *User     `json:"user"`
	EntryAt   time.Time `json:"entryAt"`
	ReleaseAt time.Time `json:"releaseAt"`
}

// Chat : личные сообщения
type Chat struct {
	ID       uint       `json:"id"`
	User1    *User      `json:"user1"`
	User2    *User      `json:"user2"`
	Messages []*Message `json:"messages"`
}

// Message : сообщение
type Message struct {
	ID       uint      `json:"id"`
	Sender   *User     `json:"sender"`
	Content  string    `json:"content"`
	SendTime time.Time `json:"sendTime"`
}
