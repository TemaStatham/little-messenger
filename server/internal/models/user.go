package models

// User : пользователь
type User struct {
	ID        uint     `json:"id"`
	Username  string   `json:"username"`
	FirstName string   `json:"firstName"`
	LastName  string   `json:"lastName"`
	Email     string   `json:"email"`
	Password  string   `json:"password"`
	ImageURLs []string `json:"imageURL"`
	Contacts  []*User  `json:"contacts"`
}
