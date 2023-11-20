package models

import "time"

type User struct {
	ID          uint      `json:"id" gorm:"primaryKey;unique"`
	Age         uint      `json:"age"`
	GoogleImage string    `json:"googleImage"`
	FirstName   string    `json:"firstName" gorm:"not null"`
	LastName    string    `json:"lastName" gorm:"not null"`
	UserName    string    `json:"userName" gorm:"not null;unique"`
	Email       string    `json:"email" gorm:"unique;not null"`
	Password    string    `json:"password"`
	CreatedAt   time.Time `json:"createdAt" gorm:"not null"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Contacts struct {
	ID      uint `json:"id" gorm:"primaryKey;unique"`
	User1ID uint `json:"user1_id" gorm:"not null"`
	User1   User `json:"user1" gorm:"foreignKey:User1ID"`
	User2ID uint `json:"user2_id" gorm:"not null"`
	User2   User `json:"user2" gorm:"foreignKey:User2ID"`
}
