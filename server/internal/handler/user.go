package handler

import (
	"io/ioutil"
	"net/http"

	"github.com/TemaStatham/Little-Messenger/internal/models"
	"github.com/gin-gonic/gin"
)

func (h *Handler) options(c *gin.Context) {
	c.Header("Access-Control-Allow-Methods", "POST")
	c.Header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
	c.Status(http.StatusOK)
}

func (h *Handler) signUp(c *gin.Context) {
	var input models.User

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid input body")
		return
	}

	_, err := h.services.User.CreateUser(&input)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"status": "Успешная регистрация",
	})
}

type signInInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) signIn(c *gin.Context) {
	var input signInInput

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	token, err := h.services.User.GenerateToken(input.Email, input.Password)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	// user, err := h.services.GetUserByEmail(input.Email, input.Password)
	// if err != nil {
	// 	newErrorResponse(c, http.StatusInternalServerError, err.Error())
	// 	return
	// }
	//u := *user

	c.JSON(http.StatusOK, map[string]interface{}{
		"token": token,
		//"user":  u,
	})
}

func (h *Handler) uploadFile(c *gin.Context) {
	// Parse our multipart form, 10 << 20 specifies a maximum
	// upload of 10 MB files.
	
	err := c.Request.ParseMultipartForm(10 << 20)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	// FormFile returns the first file for the given key `myFile`
	// it also returns the FileHeader so we can get the Filename,
	// the Header and the size of the file
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "Error Retrieving the File")
		return
	}
	defer file.Close()
	
	// Create a temporary file within our temp-images directory that follows
	// a particular naming pattern
	tempFile, err := ioutil.TempFile("./images", "upload-*.png")
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	defer tempFile.Close()
	
	// read all of the contents of our uploaded file into a
	// byte array
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	
	// write this byte array to our temporary file
	_, err = tempFile.Write(fileBytes)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	
	c.JSON(http.StatusOK, map[string]interface{}{
		"filePath": tempFile.Name(),
	})

}
