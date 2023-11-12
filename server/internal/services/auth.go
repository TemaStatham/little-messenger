package services

import "github.com/TemaStatham/Little-Messenger/internal/repository"

type AuthService struct {
	repo repository.Authorization
}

func NewAuthService(repo repository.Authorization) *AuthService {
	return &AuthService{repo: repo}
}
