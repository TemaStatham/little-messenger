package repository

import (
	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/jmoiron/sqlx"
)

type AuthPostgres struct {
	db *sqlx.DB
}

func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

func (r *AuthPostgres) CreateUser(user *models.User) error {

	return nil
}

func (r *AuthPostgres) GetUser(email, password string) (user models.User, err error) {
	//query := `SELECT * FROM users WHERE email = $1 AND password = $2`

	err = nil

	return
}

func (r *AuthPostgres) GetUserByID(userID uint) (user models.User, err error) {
	//query := `SELECT * FROM users WHERE id = $1`

	err = nil

	return
}
