package main

import (
	"fmt"
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func InitDB() {
	dsn := os.Getenv("database")
	
	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("Database Error: %v\n", err)
		os.Exit(1)
	}

	db.AutoMigrate(&Teacher{}, &Course{}, &Section{}, &Student{}, &Session{}, &Attendance{})
}