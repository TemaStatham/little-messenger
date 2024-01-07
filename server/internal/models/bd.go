package models

import "time"

// UserBD : пользователь
type UserBD struct {
	ID        uint      `json:"id" db:"id"`
	Username  string    `json:"username" db:"username"`
	FirstName string    `json:"firstName" db:"first_name"`
	LastName  string    `json:"lastName" db:"last_name"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"password" db:"password"`
	ImageURLs []string  `json:"imageURL" db:"-"`
	Contacts  []Contact `json:"contacts" db:"-"`
}

// ContactBD : контакт
type ContactBD struct {
	ID        uint   `json:"id" db:"id"`
	Username  string `json:"username" db:"username"`
	FirstName string `json:"first_name" db:"first_name"`
	LastName  string `json:"last_name" db:"last_name"`
	Email     string `json:"email" db:"email"`
}

// ChatBD : общий чат
type ChatBD struct {
	ID       uint   `json:"id" db:"id"`
	TypeName string `json:"type_name" db:"type_name"`
}

// PublicChatBD : публичная беседа
type PublicChatBD struct {
	ChatID       uint      `json:"chat_id" db:"chat_id"`
	CreatorID    uint      `json:"creator_user_id" db:"creator_user_id"`
	Name         string    `json:"name" db:"name"`
	CreationDate time.Time `json:"creation_date" db:"creation_date"`
}

// PrivateChatBD : личные сообщения
type PrivateChatBD struct {
	ID      uint `json:"id" db:"id"`
	User1ID uint `json:"user1_id" db:"user1_id"`
	User2ID uint `json:"user2_id" db:"user2_id"`
	ChatID  uint `json:"chat_id" db:"chat_id"`
}

// ChatPhotoBD : фотографии для чата
type ChatPhotoBD struct {
	ID      uint   `json:"id" db:"id"`
	URLPath string `json:"url_path" db:"url_path"`
	ChatID  uint   `json:"chat_id" db:"chat_id"`
}

// MessageBD : сообщение
type MessageBD struct {
	ID       uint      `json:"id" db:"id"`
	Content  string    `json:"content" db:"content"`
	UserID   uint      `json:"user_id" db:"user_id"`
	ChatID   uint      `json:"chat_id" db:"chat_id"`
	SendTime time.Time `json:"send_time" db:"send_time"`
}

// ChatMemberBD : участник чата
type ChatMemberBD struct {
	ID        uint      `json:"id" db:"id"`
	UserID    uint      `json:"user_id" db:"user_id"`
	ChatID    uint      `json:"chat_id" db:"chat_id"`
	JoinDate  time.Time `json:"join_date" db:"join_date"`
	LeaveDate time.Time `json:"leave_date" db:"leave_date"`
}

// AttachmentBD : вложение к чату
type AttachmentBD struct {
	ID      uint `json:"id" db:"id"`
	ChatID  uint `json:"chat_id" db:"chat_id"`
	PhotoID uint `json:"photo_id" db:"photo_id"`
}
