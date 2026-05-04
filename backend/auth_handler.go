package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func registerTeacher(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
		Name     string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, _ := HashPassword(input.Password)
	teacher := Teacher{Email: input.Email, Password: hashedPassword, Name: input.Name}

	if err := db.Create(&teacher).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Registration successful"})
}

func loginTeacher(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var teacher Teacher
	if err := db.Where("email = ?", input.Email).First(&teacher).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Teacher not found"})
		return
	}

	if !CheckPasswordHash(input.Password, teacher.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	token, _ := GenerateJWT(teacher.ID)
	c.JSON(http.StatusOK, gin.H{"token": token, "user": teacher})
}