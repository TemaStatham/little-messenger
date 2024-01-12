package handler

import (
	"github.com/TemaStatham/Little-Messenger/internal/server"
	"github.com/TemaStatham/Little-Messenger/internal/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	services  *services.Service
	websocket *server.WebSocket
}

func NewHandler(services *services.Service, websocket *server.WebSocket) *Handler {
	return &Handler{
		services:  services,
		websocket: websocket,
	}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "OPTIONS"}
	config.AllowHeaders = []string{"Authorization", "Content-Type"}

	router.Use(cors.New(config))

	auth := router.Group("/auth")
	{
		auth.OPTIONS("/sign-up", h.options)
		auth.OPTIONS("/sign-in", h.options)
		auth.POST("/sign-up", h.signUp)
		auth.POST("/sign-in", h.signIn)
	}

	api := router.Group("/api")
	{
		api.OPTIONS("", h.options)
		api.POST("", h.userIdentity)
		api.POST("/upload", h.uploadFile)
		api.OPTIONS("/upload", h.options)
	}
	
	router.Static("/images", "./images")

	hub := server.NewHub()
	go hub.Run()
	router.GET("/ws", func(c *gin.Context) {
		h.websocket.ServeWebSocket(c, hub)
	})
	router.POST("/ws", func(c *gin.Context) {
		h.websocket.ServeWebSocket(c, hub)
	})

	return router
}
