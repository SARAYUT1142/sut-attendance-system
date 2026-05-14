func InitDB() {
    var dsn string

    // ลองอ่านจาก env variable "database" ก่อน (ใช้ตอน local)
    dsn = os.Getenv("database")

    // ถ้าไม่มี → ประกอบจาก env variables แยก (ใช้ตอน Kubernetes)
    if dsn == "" {
        host     := os.Getenv("DB_HOST")
        port     := os.Getenv("DB_PORT")
        user     := os.Getenv("DB_USER")
        password := os.Getenv("DB_PASSWORD")
        dbname   := os.Getenv("DB_NAME")

        dsn = fmt.Sprintf(
            "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
            host, port, user, password, dbname,
        )
    }

    var err error
    db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        fmt.Printf("Database Error: %v\n", err)
        os.Exit(1)
    }

    db.AutoMigrate(&Teacher{}, &Course{}, &Section{}, &Student{}, &Session{}, &Attendance{})
}