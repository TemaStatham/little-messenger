package models

// User : пользователь
type User struct {
	Username  string `json:"username"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	ImageURL  string `json:"imageURL"`
	Contacts  []User `json:"contacts"`
}
