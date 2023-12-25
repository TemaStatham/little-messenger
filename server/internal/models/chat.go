package models

import "time"

// Conversation : беседа
type Conversation struct {
	Users     []*ConversationMember
	CreatedAt time.Time  `json:"createdAt"`
	Messages  []*Message `json:"messages"`
}

// ConversationMember : участник беседы
type ConversationMember struct {
	User      *User     `json:"user"`
	EntryAt   time.Time `json:"entryAt"`
	ReleaseAt time.Time `json:"releaseAt"`
}

// Chat : личные сообщения
type Chat struct {
	User1    *User      `json:"user1"`
	User2    *User      `json:"user2"`
	Messages []*Message `json:"messages"`
}

// Message : сообщение
type Message struct {
	Sender    *User     `json:"sender"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
}
