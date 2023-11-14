package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type SignInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handler) optionsSignIn(c *gin.Context) {
    c.Header("Access-Control-Allow-Methods", "POST")
    c.Header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    c.Status(http.StatusOK)
}

func (h *Handler) signUp(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
        "message": "Успешный вход",
	})
}

func (h *Handler) signIn(c *gin.Context) {

	var request SignInRequest

	// Попытка извлечь данные из JSON-тела запроса
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Неверный формат данных",
		})
		return
	}

	// В request теперь содержатся данные из тела запроса
	email := request.Email
	password := request.Password


	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
        "message": email + " " + password,
	})
}
