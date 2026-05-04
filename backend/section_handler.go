package main

import (
	"encoding/csv"
	"net/http"
	"github.com/gin-gonic/gin"
)

func getSections(c *gin.Context) {
	courseID := c.Param("id")
	var sections []Section
	db.Where("course_id = ?", courseID).Find(&sections)
	c.JSON(http.StatusOK, sections)
}

func createSection(c *gin.Context) {
	var section Section
	if err := c.ShouldBindJSON(&section); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&section)
	c.JSON(http.StatusCreated, section)
}

func updateSection(c *gin.Context) {
	id := c.Param("id")
	var section Section
	if err := db.First(&section, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}
	c.ShouldBindJSON(&section)
	db.Save(&section)
	c.JSON(http.StatusOK, section)
}

func deleteSection(c *gin.Context) {
	id := c.Param("id")
	db.Delete(&Section{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Section deleted"})
}

func getSectionStudents(c *gin.Context) {
	sectionID := c.Param("id")
	var section Section
	db.Preload("Students").First(&section, sectionID)
	c.JSON(http.StatusOK, section.Students)
}

func addStudentToSection(c *gin.Context) {
	sectionID := c.Param("id")
	var input Student
	c.ShouldBindJSON(&input)
	var section Section
	if err := db.First(&section, sectionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Section not found"})
		return
	}
	db.FirstOrCreate(&input)
	db.Model(&section).Association("Students").Append(&input)
	c.JSON(http.StatusOK, input)
}

func updateStudentInSection(c *gin.Context) {
	studentID := c.Param("sid")
	var input struct {
		Name string `json:"name" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var student Student
	if err := db.First(&student, "id = ?", studentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}
	student.Name = input.Name
	db.Save(&student)
	c.JSON(http.StatusOK, student)
}

func removeStudentFromSection(c *gin.Context) {
	sectionID := c.Param("id")
	studentID := c.Param("sid")
	var section Section
	db.First(&section, sectionID)
	var student Student
	db.First(&student, "id = ?", studentID)
	db.Model(&section).Association("Students").Delete(&student)
	c.JSON(http.StatusOK, gin.H{"message": "Student removed"})
}

func importStudentsCSV(c *gin.Context) {
	sectionID := c.Param("id")
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}
	defer file.Close()
	reader := csv.NewReader(file)
	records, _ := reader.ReadAll()
	var section Section
	db.First(&section, sectionID)
	for i, record := range records {
		if i == 0 || len(record) < 2 { continue }
		student := Student{ID: record[0], Name: record[1]}
		db.FirstOrCreate(&student)
		db.Model(&section).Association("Students").Append(&student)
	}
	c.JSON(http.StatusOK, gin.H{"message": "CSV imported successfully"})
}