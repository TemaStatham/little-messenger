package repository

import (
	"fmt"

	"github.com/TemaStatham/Little-Messenger/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	Host     string
	Port     string
	Username string
	Password string
	DBName   string
	SSLMode  string
}

func NewPostgresDB(cfg Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s dbname=%s port=%s password=%s sslmode=%s",
		cfg.Host, cfg.Username, cfg.DBName, cfg.Port, cfg.Password, cfg.SSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		SkipDefaultTransaction: true,
	})

	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(
		models.User{},
		models.RefreshSession{},
		models.Chat{},
		models.Message{},
		models.Conversation{},
		models.ConversationParticipant{},
		models.Contacts{},
	)

	if err != nil {
		return nil, err
	}

	return db, nil
}
