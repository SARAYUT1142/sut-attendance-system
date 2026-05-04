package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func getCourses(c *gin.Context) {
	teacherID := c.MustGet("teacher_id").(uint)
	var courses []Course
	db.Where("teacher_id = ?", teacherID).Find(&courses)
	c.JSON(http.StatusOK, courses)
}

func createCourse(c *gin.Context) {
	teacherID := c.MustGet("teacher_id").(uint)
	var course Course
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	course.TeacherID = teacherID
	db.Create(&course)
	c.JSON(http.StatusCreated, course)
}

func updateCourse(c *gin.Context) {
	id := c.Param("id")
	teacherID := c.MustGet("teacher_id").(uint)
	var course Course
	if err := db.Where("id = ? AND teacher_id = ?", id, teacherID).First(&course).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}
	c.ShouldBindJSON(&course)
	db.Save(&course)
	c.JSON(http.StatusOK, course)
}

func deleteCourse(c *gin.Context) {
	id := c.Param("id")
	teacherID := c.MustGet("teacher_id").(uint)
	db.Where("id = ? AND teacher_id = ?", id, teacherID).Delete(&Course{})
	c.JSON(http.StatusOK, gin.H{"message": "Course deleted"})
}