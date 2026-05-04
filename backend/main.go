package main

import (
	"log"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	
	err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

	InitDB()

	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	api := r.Group("/api")
	{
		api.POST("/auth/register", registerTeacher)
		api.POST("/auth/login", loginTeacher)
		api.POST("/check-in", studentCheckIn)

		protected := api.Group("/")
		protected.Use(AuthMiddleware())
		{
			protected.GET("/courses", getCourses)
			protected.POST("/courses", createCourse)
			protected.PUT("/courses/:id", updateCourse)
			protected.DELETE("/courses/:id", deleteCourse)

			protected.GET("/courses/:id/sections", getSections)
			protected.POST("/sections", createSection)
			protected.PUT("/sections/:id", updateSection)
			protected.DELETE("/sections/:id", deleteSection)

			protected.GET("/sections/:id/students", getSectionStudents)
			protected.POST("/sections/:id/students", addStudentToSection)
			protected.PUT("/sections/:id/students/:sid", updateStudentInSection)
			protected.POST("/sections/:id/students/import", importStudentsCSV)
			protected.DELETE("/sections/:id/students/:sid", removeStudentFromSection)

			protected.GET("/sections/:id/sessions", getSessions)
			protected.POST("/sessions", createSession)
			protected.PATCH("/sessions/:id/toggle", toggleSessionStatus)
			protected.DELETE("/sessions/:id", deleteSession)
			protected.GET("/sessions/:id/report", getAttendanceReport)
			protected.PUT("/sessions/:id", updateSession)
		}
	}

	r.Run(":8080")
}