pipeline {
    agent any 
    
    environment {
        // อ้างอิง ID ของรหัสผ่านที่เราเพิ่งตั้งไว้ใน Jenkins
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        
        // ⚠️ สำคัญ: เปลี่ยน [YOUR_DOCKERHUB_USERNAME] เป็น Username ของคุณ
        DOCKER_IMAGE = "sarayut1142/sut-attendance-frontend:latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'ดึงโค้ดล่าสุดจาก GitHub...'
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'กำลังสร้าง Docker Image สำหรับหน้าเว็บ...'
                sh 'docker build -t ${DOCKER_IMAGE} .'
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo 'กำลังอัปโหลด Image ขึ้น Docker Hub...'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push ${DOCKER_IMAGE}'
            }
        }
    }
    
    post {
        always {
            echo 'ล้างข้อมูลการล็อกอิน...'
            sh 'docker logout'
        }
    }
}