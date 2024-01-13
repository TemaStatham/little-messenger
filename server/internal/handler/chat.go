package handler

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (h *Handler) uploadFileGroup(c *gin.Context) {
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

	id := c.PostForm("id")

	uintValue, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		fmt.Println("Ошибка при преобразовании строки в uint:", err)
		return
	}

	// Create a temporary file within our temp-images directory that follows
	// a particular naming pattern
	tempFile, err := ioutil.TempFile("./images", "upload-*.png")
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	_, fileName := filepath.Split(tempFile.Name())

	err = h.services.ChangeImgPubChat(uint(uintValue), fmt.Sprintf("http://localhost:8080/images/%s", fileName))
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
		"filePath": fmt.Sprintf("http://localhost:8080/images/%s", fileName),
	})

}
