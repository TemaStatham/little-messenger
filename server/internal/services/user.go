package services

import (
	"crypto/sha1"
	"errors"
	"fmt"
	"time"

	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/TemaStatham/Little-Messenger/internal/repository"
	"github.com/dgrijalva/jwt-go"
)

// Константы для аутентификации и обработки токенов.
const (
	salt       = "slat"
	signingKey = "signingKey"
	tokenTTL   = 12 * time.Hour
)

// tokenClaims представляет пользовательские JWT-клеймы для аутентификационного токена.
type tokenClaims struct {
	jwt.StandardClaims
	ID uint `json:"id"`
}

// UserService предоставляет методы для управления пользователями и аутентификации.
type UserService struct {
	repo repository.User
}

// NewUserService создает новый экземпляр UserService с предоставленным репозиторием пользователей.
func NewUserService(repo repository.User) *UserService {
	return &UserService{repo: repo}
}

// CreateUser создает нового пользователя и возвращает идентификатор пользователя.
func (a *UserService) CreateUser(user *models.User) (uint, error) {
	user.Password = generatePasswordHash(user.Password)

	id, err := a.repo.CreateUser(user)
	if err != nil {
		return 0, nil
	}

	err = a.repo.CreateUserPhoto(id, "http://localhost:8080/images/default.png")
	if err != nil {
		return 0, nil
	}

	return id, nil
}

// GenerateToken генерирует аутентификационный токен для указанного email и пароля.
func (a *UserService) GenerateToken(email, password string) (string, error) {
	user, err := a.repo.GetUserByEmail(email, generatePasswordHash(password))
	if err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(tokenTTL).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		user.ID,
	})

	return token.SignedString([]byte(signingKey))
}

// ParseToken разбирает переданный access token и возвращает связанное с ним имя пользователя.
func (a *UserService) ParseToken(accessToken string) (uint, error) {
	token, err := jwt.ParseWithClaims(accessToken, &tokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return 0, errors.New("недопустимый метод подписи")
		}

		return []byte(signingKey), nil
	})
	if err != nil {
		return 0, err
	}

	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return 0, errors.New("клеймы токена не являются типом *tokenClaims")
	}

	return claims.ID, nil
}

// GetUserByEmail извлекает пользователя по его параметрам.
func (a *UserService) GetUserByEmail(email, password string) (models.User, error) {

	user, err := a.repo.GetUserByEmail(email, generatePasswordHash(password))
	if err != nil {
		return models.User{}, err
	}

	photo, err := a.repo.GetUserLastPhotoByUserID(user.ID)
	if err != nil {
		return models.User{}, err
	}

	user.ImageURLs = photo

	contacts, err := a.repo.GetContactsByUserID(user.ID)
	if err != nil {
		return models.User{}, err
	}

	user.Contacts = contacts

	return user, nil
}

// GetUserByID извлекает пользователя по его идентификатору.
func (a *UserService) GetUserByID(userID uint) (models.User, error) {
	user, err := a.repo.GetUserByID(userID)
	if err != nil {
		return models.User{}, err
	}

	photo, err := a.repo.GetUserLastPhotoByUserID(user.ID)
	if err != nil {
		return models.User{}, err
	}

	user.ImageURLs = photo

	contacts, err := a.repo.GetContactsByUserID(user.ID)
	if err != nil {
		return models.User{}, err
	}

	user.Contacts = contacts

	return user, nil
}

// generatePasswordHash генерирует SHA-1 хэш для предоставленного пароля.
func generatePasswordHash(password string) string {
	hash := sha1.New()
	hash.Write([]byte(password))

	return fmt.Sprintf("%x", hash.Sum([]byte(salt)))
}

// GetUsers получает всех пользователей зарегестрированных в бд
func (a *UserService) GetUsers() ([]models.Contact, error) {
	return a.repo.GetUsers()
}

// CreateContact создает контакт
func (a *UserService) CreateContact(userID1 string, userID2 string) error {
	return a.repo.CreateContact(userID1, userID2)
}

// ChangeProfile меняет профиль пользователя
func (a *UserService) ChangeProfile(u models.User) error {
	err := a.repo.ChangeProfile(u)
	if err != nil {
		return err
	}

	err = a.repo.CreateUserPhoto(u.ID, u.ImageURLs)
	if err != nil {
		return err
	}

	return nil
}
