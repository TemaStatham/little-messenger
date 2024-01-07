package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	authorizationHeader = "Authorization"
	userCtx             = "userId"
)

func (h *Handler) userIdentity(c *gin.Context) {
	if c.Request.Method == "OPTIONS" {
		c.Next()
		return
	}

	header := c.GetHeader(authorizationHeader)
	if header == "" {
		newErrorResponse(c, http.StatusUnauthorized, "empty auth header")
		return
	}

	headerParts := strings.Split(header, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		newErrorResponse(c, http.StatusUnauthorized, "invalid auth header")
		return
	}

	if len(headerParts[1]) == 0 {
		newErrorResponse(c, http.StatusUnauthorized, "token is empty")
		return
	}

	userID, err := h.services.User.ParseToken(headerParts[1])
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	user, err := h.services.GetUserByID(userID)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	// chats, err := h.services.GetConversationsByUserID(userID)
	// if err != nil {
	// 	newErrorResponse(c, http.StatusUnauthorized, err.Error())
	// 	return
	// }

	c.Set(userCtx, userID)
	c.JSON(http.StatusOK, map[string]interface{}{
		"user": user,
		//"chat": chats,
	})
}
