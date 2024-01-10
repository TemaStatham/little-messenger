package repository

import (
	"database/sql"
	"fmt"

	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/jmoiron/sqlx"
)

const (
	errorID = 0
)

// UserPostgres - структура, представляющая репозиторий для взаимодействия с данными пользователей в PostgreSQL.
type UserPostgres struct {
	db *sqlx.DB
}

// NewUserPostgres - конструктор для создания нового экземпляра AuthPostgres.
func NewUserPostgres(db *sqlx.DB) *UserPostgres {
	return &UserPostgres{db: db}
}

// CreateUser - метод для создания нового пользователя в базе данных.
func (r *UserPostgres) CreateUser(user *models.User) (uint, error) {
	query := `
		INSERT INTO users (username, first_name, last_name, email, password)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`

	var id uint

	if err := r.db.QueryRow(query, user.Username, user.FirstName, user.LastName, user.Email, user.Password).Scan(&id); err != nil {
		return errorID, fmt.Errorf("error creating user: %v", err)
	}

	return id, nil
}

// CreateUserPhoto - метод создания пользователя в базе данных.
func (r *UserPostgres) CreateUserPhoto(userID uint, imageURLs []string) error {
	for _, url := range imageURLs {
		query := `
            INSERT INTO user_photos (path, user_id)
            VALUES ($1, $2)
        `
		_, err := r.db.Exec(query, url, userID)
		if err != nil {
			return fmt.Errorf("error creating user photo: %v", err)
		}
	}

	return nil
}

// CreateContact - метод для вставки новой записи в таблицу contacts.
func (r *UserPostgres) CreateContact(user1ID, user2ID string) error {
	query := `
        INSERT INTO contacts (user1_id, user2_id)
        VALUES ($1, $2)
    `

	_, err := r.db.Exec(query, user1ID, user2ID)
	if err != nil {
		return fmt.Errorf("error inserting contact: %v", err)
	}

	return nil
}

// GetUserByEmail - метод для получения пользователя из базы данных по адресу электронной почты и паролю.
func (r *UserPostgres) GetUserByEmail(email, password string) (models.User, error) {
	query := `
		SELECT u.id, u.username, u.first_name, u.last_name, u.email, u.password 
		FROM users u
		WHERE u.email = $1 AND u.password = $2
	`

	var u models.User

	if err := r.db.Get(&u, query, email, password); err != nil {
		if err == sql.ErrNoRows {
			return models.User{}, fmt.Errorf("error get user by email : user not found")
		}
		return models.User{}, fmt.Errorf("error get user by email: %s", err.Error())
	}

	return u, nil
}

// GetUserByID - метод для получения пользователя из базы данных по его идентификатору.
func (r *UserPostgres) GetUserByID(userID uint) (models.User, error) {
	query := `
		SELECT id, username, first_name, last_name, email, password 
		FROM users 
		WHERE id = $1
	`

	var u models.User

	if err := r.db.Get(&u, query, userID); err != nil {
		if err == sql.ErrNoRows {
			return models.User{}, fmt.Errorf("error get user by id : user not found")
		}
		return models.User{}, fmt.Errorf("error get user by id %s: ", err.Error())
	}

	return u, nil
}

// GetUsers получает всех пользователей из бд
func (r *UserPostgres) GetUsers() ([]models.Contact, error) {
	query := `
		SELECT id, username, first_name, last_name, email 
		FROM users 
	`

	users := []models.Contact{}

	if err := r.db.Select(&users, query); err != nil {
		if err == sql.ErrNoRows {
			return []models.Contact{}, fmt.Errorf("error getting users: no rows found")
		}
		return []models.Contact{}, fmt.Errorf("error getting users: %s", err.Error())
	}

	return users, nil
}

// GetUserPhotosByUserID - метод для получения всех путей к фотографиям пользователя из базы данных по его идентификатору.
func (r *UserPostgres) GetUserPhotosByUserID(userID uint) ([]string, error) {
	var paths []string

	query := `
		SELECT path 
		FROM user_photos 
		WHERE user_id = $1
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("error querying user photos: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var path string
		if err := rows.Scan(&path); err != nil {
			return nil, fmt.Errorf("error scanning user photo path: %v", err)
		}
		paths = append(paths, path)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over user photos: %v", err)
	}

	return paths, nil
}

// GetContactsIDsByUserID - метод для получения всех айди контактов у пользователя.
func (r *UserPostgres) GetContactsIDsByUserID(userID uint) ([]uint, error) {
	var userIDs []uint

	query := `SELECT id, user1_id, user2_id FROM contacts WHERE user1_id = $1 OR user2_id = $1`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("error querying contact IDs: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var user1ID, user2ID uint
		if err := rows.Scan(&user1ID, &user2ID); err != nil {
			return nil, fmt.Errorf("error scanning contact IDs: %v", err)
		}

		if user1ID == userID {
			userIDs = append(userIDs, user2ID)
			continue
		}

		userIDs = append(userIDs, user1ID)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over contacts: %v", err)
	}

	return userIDs, nil
}

// GetContactsByUserID - метод для получения всех контактов пользователя из базы данных по его идентификатору.
func (r *UserPostgres) GetContactsByUserID(userID uint) ([]models.Contact, error) {
	query := `
		SELECT u.id, u.username, u.first_name, u.last_name, u.email
		FROM users u
		JOIN contacts c ON u.id = c.user2_id
		WHERE c.user1_id = $1
	`

	contacts := []models.Contact{}
	if err := r.db.Select(&contacts, query, userID); err != nil {
		return nil, fmt.Errorf("error getting contacts by user ID: %s", err.Error())
	}

	return contacts, nil
}
