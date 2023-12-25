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

const (
	salt       = "slat"
	signingKey = "signingKey"
	tokenTTL   = 12 * time.Hour
)

type tokenClaims struct {
	jwt.StandardClaims
	UserName string `json:"userName"`
}

type AuthService struct {
	repo repository.Authorization
}

func NewAuthService(repo repository.Authorization) *AuthService {
	return &AuthService{repo: repo}
}

func (a *AuthService) CreateUser(user *models.User) error {
	user.Password = generatePasswordHash(user.Password)
	return a.repo.CreateUser(user)
}

func (a *AuthService) GenerateToken(email, password string) (string, error) {
	user, err := a.repo.GetUser(email, generatePasswordHash(password))
	if err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(tokenTTL).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		user.FirstName,
	})

	return token.SignedString([]byte(signingKey))
}

func (a *AuthService) ParseToken(accessToken string) (string, error) {
	token, err := jwt.ParseWithClaims(accessToken, &tokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return "", errors.New("invalid signing method")
		}

		return []byte(signingKey), nil
	})
	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return "", errors.New("token claims are not of type *tokenClaims")
	}

	return claims.UserName, nil
}

func (a *AuthService) GetUserByID(userID uint) (models.User, error) {

	return a.repo.GetUserByID(userID)
}

func generatePasswordHash(password string) string {
	hash := sha1.New()
	hash.Write([]byte(password))

	return fmt.Sprintf("%x", hash.Sum([]byte(salt)))
}
