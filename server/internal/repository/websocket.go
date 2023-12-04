package repository

import "gorm.io/gorm"

type WebSocketPostgres struct {
	db *gorm.DB
}

func NewWebSocketPostgres(db *gorm.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}