package repository

import (
	"fmt"

	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/jmoiron/sqlx"
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
	var id uint

	query := `
		INSERT INTO users (username, first_name, last_name, email, password
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`

	err := r.db.QueryRow(query,
		user.Username,
		user.FirstName,
		user.LastName,
		user.Email,
		user.Password,
	).Scan(&id)

	if err != nil {
		return 0, fmt.Errorf("error creating user: %v", err)
	}

	if err := r.CreateUserPhoto(user.ID, user.ImageURLs); err != nil {
		return 0, fmt.Errorf("error creating user: %v", err)
	}

	return id, nil
}

// CreateUserPhoto - метод создания пользователя в базе данных.
func (r *UserPostgres) CreateUserPhoto(userID uint, imageURLs []string) error {
	for _, url := range imageURLs {
		var id uint

		query := `
			INSERT INTO user_photos (path, user_id)
			VALUES ($1, $2)
			RETURNING id
		`

		err := r.db.QueryRow(query,
			url,
			userID,
		).Scan(&id)

		if err != nil {
			return fmt.Errorf("error creating user photo: %v", err)
		}
	}

	return nil
}

// CreateContact - метод для вставки новой записи в таблицу contacts.
func (r *UserPostgres) CreateContact(user1ID, user2ID uint) (contactID int, err error) {
	query := `
        INSERT INTO contacts (user1_id, user2_id)
        VALUES ($1, $2)
        RETURNING id
    `

	err = r.db.QueryRow(query, user1ID, user2ID).Scan(&contactID)
	if err != nil {
		return 0, fmt.Errorf("error inserting contact: %v", err)
	}

	return contactID, nil
}

// GetUser - метод для получения пользователя из базы данных по адресу электронной почты и паролю.
func (r *UserPostgres) GetUser(email, password string) (user *models.User, err error) {
	query := `SELECT * FROM users WHERE email = $1 AND password = $2`
	err = r.db.Get(&user, query, email, password)

	if err != nil {
		return nil, fmt.Errorf("error get user: %s", err.Error())
	}

	user.ImageURLs, err = r.GetUserPhotosByUserID(user.ID)
	if err != nil {
		return nil, err
	}

	user.Contacts, err = r.GetContactsByUserID(user.ID)
	if err != nil {
		return nil, err
	}

	return
}

// GetUserByID - метод для получения пользователя из базы данных по его идентификатору.
func (r *UserPostgres) GetUserByID(userID uint) (user *models.User, err error) {
	query := `SELECT * FROM users WHERE id = $1`
	err = r.db.Get(&user, query, userID)

	if err != nil {
		return nil, fmt.Errorf("error get user %s: ", err.Error())
	}

	user.ImageURLs, err = r.GetUserPhotosByUserID(user.ID)
	if err != nil {
		return nil, err
	}

	user.Contacts, err = r.GetContactsByUserID(user.ID)
	if err != nil {
		return nil, err
	}

	return
}

// GetUserPhotosByUserID - метод для получения всех путей к фотографиям пользователя из базы данных по его идентификатору.
func (r *UserPostgres) GetUserPhotosByUserID(userID uint) ([]string, error) {
	var paths []string

	query := `SELECT path FROM user_photos WHERE user_id = $1`

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

	rows, err := r.db.Query(query)
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
func (r *UserPostgres) GetContactsByUserID(userID uint) ([]*models.User, error) {
	userIDs, err := r.GetContactsIDsByUserID(userID)
	if err != nil {
		return nil, err
	}

	users := make([]*models.User, 0)
	for _, id := range userIDs {
		user, err := r.GetUserByID(id)
		if err != nil {
			return nil, err
		}

		users = append(users, user)
	}

	return users, nil
}
