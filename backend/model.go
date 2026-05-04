package main

import "time"

type Teacher struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Email     string    `gorm:"unique;not null" json:"email"`
	Password  string    `json:"-"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

type Course struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	TeacherID uint      `json:"teacher_id"`
	Name      string    `gorm:"not null" json:"name"`
	Term      string    `json:"term"`
	Year      string    `json:"year"`
	Sections  []Section `gorm:"foreignKey:CourseID;constraint:OnDelete:CASCADE" json:"sections"`
}

type Section struct {
	ID       uint      `gorm:"primaryKey" json:"id"`
	CourseID uint      `json:"course_id"`
	Name     string    `json:"name"`
	Students []Student `gorm:"many2many:section_students;" json:"students"`
	Sessions []Session `gorm:"foreignKey:SectionID;constraint:OnDelete:CASCADE" json:"sessions"`
}

type Student struct {
	ID   string `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
}

type Session struct {
	ID        uint         `gorm:"primaryKey" json:"id"`
	SectionID uint         `json:"section_id"`
	Title     string       `json:"title"`
	Date      string       `json:"date"`
	IsOpen    bool         `gorm:"default:true" json:"is_open"`
	Attend    []Attendance `gorm:"foreignKey:SessionID;constraint:OnDelete:CASCADE" json:"attendance"`
}

type Attendance struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	SessionID uint      `json:"session_id"`
	StudentID string    `json:"student_id"`
	CheckTime time.Time `json:"check_time"`
}