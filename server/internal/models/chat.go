package models

import "time"

type Conversation struct {
	ID           uint                      `json:"id" gorm:"primaryKey;not null"`
	Participants []ConversationParticipant `json:"participants" gorm:"foreignKey:ChatID"`
	CreatedAt    time.Time                 `json:"created_at" gorm:"not null"`
}

type ConversationParticipant struct {
	ID        uint      `json:"id" gorm:"primaryKey;not null"`
	ChatID    uint      `json:"chat_id" gorm:"not null"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	User      User      `json:"user" gorm:"foreignKey:UserID"`
	CreatedAt time.Time `json:"created_at" gorm:"not null"`
}

type Chat struct {
	ID        uint      `json:"id" gorm:"primaryKey;not null"`
	User1ID   uint      `json:"user1_id" gorm:"not null"`
	User1     User      `json:"user1_" gorm:"foreignKey:User1ID"`
	User2ID   uint      `json:"user2_id" gorm:"not null"`
	User2     User      `json:"user2" gorm:"foreignKey:User2ID"`
	CreatedAt time.Time `json:"created_at" gorm:"not null"`
}

type Message struct {
	ID        uint      `json:"id" gorm:"primaryKey;not null"`
	ChatID    uint      `json:"chat_id" gorm:"not null"`
	Chat      Chat      `json:"chat" gorm:"foreignKey:ChatID"`
	SenderID  uint      `json:"sender_id" gorm:"not null"`
	Sender    User      `json:"sender" gorm:"foreignKey:SenderID"`
	Content   string    `json:"content" gorm:"not null"`
	CreatedAt time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt time.Time `json:"updated_at"`
}
