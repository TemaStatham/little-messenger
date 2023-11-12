package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) signUp(c *gin.Context) {
	c.JSON(http.StatusOK, map[string]interface{}{
		"id": 1,
	})
}

func (h *Handler) signIn(c *gin.Context) {
	c.JSON(http.StatusOK, map[string]interface{}{
		"id": 1,
	})
}
