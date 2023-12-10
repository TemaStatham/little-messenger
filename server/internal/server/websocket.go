package server

import (
	"log"
	"net/http"
	"sync"

	"github.com/TemaStatham/Little-Messenger/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type webSocketService struct {
	services    *services.Service
	upgrader    websocket.Upgrader
	connections map[uint]*websocket.Conn
	mu          sync.Mutex
}

func newWebSocketService(services *services.Service) *webSocketService {
	return &webSocketService{
		services: services,
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin:     func(r *http.Request) bool { return true },
		},
		connections: make(map[uint]*websocket.Conn),
		mu:          sync.Mutex{},
	}
}

func (c *webSocketService) ServeWebSocket(ctx *gin.Context, hub *Hub) {
	socketConn, err := c.upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		log.Println("failed to upgrade connection")
		return
	}

	client := &Client{
		hub:      hub,
		conn:     socketConn,
		send:     make(chan []byte, 256),
		services: c.services,
	}
	client.hub.register <- client

	go client.writePump()
	go client.readPump()
}

// func (c *webSocketService) verifyConnection(ctx *gin.Context) (userID string, err error) {
// 	// Положим, у вас есть логика верификации в заголовках или чем-то подобном
// 	// В данном случае, мы просто получаем идентификатор пользователя из заголовка Authorization

// 	authToken := ctx.GetHeader("Authorization")
// 	if authToken == "" {
// 		return "", errors.New("missing authorization header")
// 	}

// 	// Ваша логика верификации может быть более сложной
// 	// В этом примере мы просто используем токен как идентификатор пользователя
// 	userID = authToken

// 	return userID, nil
// }
