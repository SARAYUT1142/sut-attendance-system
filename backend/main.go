package main

import (
	"log"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {
	
	err := godotenv.Load()
    if err != nil {
        log.Println("No .env file found, falling back to system environment variables (K8s/Docker)")
    }

	InitDB()

	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// เติม 2 บรรทัดนี้ลงไป เพื่อเปิด Route /metrics 👇
    prometheusHandler := promhttp.Handler()
    r.GET("/metrics", func(c *gin.Context) {
        prometheusHandler.ServeHTTP(c.Writer, c.Request)
    })

	// Health check endpoint สำหรับ Kubernetes probe
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

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