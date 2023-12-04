package repository

import (
	"github.com/TemaStatham/Little-Messenger/internal/models"
	"gorm.io/gorm"
)

type AuthPostgres struct {
	db *gorm.DB
}

func NewAuthPostgres(db *gorm.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

func (r *AuthPostgres) CreateUser(user *models.User) error {
	query := `INSERT INTO users 
	(
		age, 
		google_image, 
		first_Name, 
		last_name,
		user_name, 
		email, 
		password, 
		created_at, 
		updated_at
	) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9)`

	err := r.db.Exec(query,
		user.Age,
		user.GoogleImage,
		user.FirstName,
		user.LastName,
		user.UserName,
		user.Email,
		user.Password,
		user.CreatedAt,
		user.UpdatedAt,
	).Error

	return err
}

func (r *AuthPostgres) GetUser(email, password string) (user models.User, err error) {
	query := `SELECT * FROM users WHERE email = $1 AND password = $2`

	err = r.db.Raw(query, email, password).Scan(&user).Error

	return
}

func (r *AuthPostgres) GetUserByID(userID uint) (user models.User, err error) {
	query := `SELECT * FROM users WHERE id = $1`

	err = r.db.Raw(query, userID).Scan(&user).Error

	return
}
