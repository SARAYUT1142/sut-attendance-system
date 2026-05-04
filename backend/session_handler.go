package main

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
)

func getSessions(c *gin.Context) {
	sectionID := c.Param("id")
	var sessions []Session
	db.Where("section_id = ?", sectionID).Order("id desc").Find(&sessions)
	c.JSON(http.StatusOK, sessions)
}

func createSession(c *gin.Context) {
	var session Session
	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&session)
	c.JSON(http.StatusCreated, session)
}

func toggleSessionStatus(c *gin.Context) {
	id := c.Param("id")
	var session Session
	if err := db.First(&session, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}
	session.IsOpen = !session.IsOpen
	db.Save(&session)
	c.JSON(http.StatusOK, session)
}

func deleteSession(c *gin.Context) {
	id := c.Param("id")
	db.Delete(&Session{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Session deleted"})
}

func studentCheckIn(c *gin.Context) {
	var input struct {
		SessionID uint   `json:"session_id" binding:"required"`
		StudentID string `json:"student_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	var sess Session
	if err := db.First(&sess, input.SessionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}
	if !sess.IsOpen {
		c.JSON(http.StatusForbidden, gin.H{"error": "Check-in is currently closed"})
		return
	}
	attendance := Attendance{
		SessionID: input.SessionID,
		StudentID: input.StudentID,
		CheckTime: time.Now(),
	}
	var existing Attendance
	if err := db.Where("session_id = ? AND student_id = ?", input.SessionID, input.StudentID).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "You have already checked in"})
		return
	}
	db.Create(&attendance)
	c.JSON(http.StatusOK, gin.H{"message": "Check-in successful", "data": attendance})
}

func getAttendanceReport(c *gin.Context) {
	sessionID := c.Param("id")
	var attendances []Attendance
	db.Where("session_id = ?", sessionID).Find(&attendances)
	c.JSON(http.StatusOK, attendances)
}

func updateSession(c *gin.Context) {
	sessionID := c.Param("id")
	var session Session
	if err := db.First(&session, sessionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}
	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Save(&session)
	c.JSON(http.StatusOK, session)
}