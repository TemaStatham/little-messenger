package server

type Hub struct {
	clients       map[*Client]bool
	broadcast     chan []byte
	register      chan *Client
	unregister    chan *Client
	chatBroadcast chan ChatBroadcastMessage
}

func NewHub() *Hub {
	return &Hub{
		broadcast:     make(chan []byte),
		register:      make(chan *Client),
		unregister:    make(chan *Client),
		clients:       make(map[*Client]bool),
		chatBroadcast: make(chan ChatBroadcastMessage),
	}
}

type ChatBroadcastMessage struct {
	ClientsIDs []uint   `json:"clientID"`
	Content  []byte `json:"content"`
}

func contains(slice []uint, element uint) bool {
    for _, e := range slice {
        if e == element {
            return true
        }
    }
    return false
}


func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		case message := <-h.chatBroadcast:
			for client := range h.clients {
				if !contains(message.ClientsIDs, client.clientID){
					continue
				}
				select {
				case client.send <- message.Content:
				default:
					close(client.send)
					delete(h.clients, client)
				}
				
			}
		}

	}
}
