pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        // 1. แยกตัวแปร Image ให้ชัดเจนทั้งหน้าบ้านและหลังบ้าน
        FRONTEND_IMAGE = "sarayut1234/sut-attendance-frontend:latest"
        BACKEND_IMAGE  = "sarayut1234/sut-attendance-backend:latest"
        DOCKER = '/usr/bin/docker'
    }

    stages {
        stage('Checkout Code') {
            steps {
                deleteDir()
                git branch: 'main',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/SARAYUT1142/sut-attendance-system.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                // 2. สั่ง Build ทีเดียวทั้งคู่
                sh "/usr/bin/docker build -t ${FRONTEND_IMAGE} ./frontend"
                sh "/usr/bin/docker build -t ${BACKEND_IMAGE} ./backend"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | /usr/bin/docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                // 3. ดันขึ้น Docker Hub ทั้งคู่
                sh "/usr/bin/docker push ${FRONTEND_IMAGE}"
                sh "/usr/bin/docker push ${BACKEND_IMAGE}"
            }
        }

        stage('Deploy to K8s') {
            steps {
                // 4. สั่ง Apply โฟลเดอร์ K8s ทั้งระบบตามลำดับ (Database ต้องมาก่อน)
                sh 'kubectl apply -f k8s/database/'
                sh 'kubectl apply -f k8s/backend/'
                sh 'kubectl apply -f k8s/frontend/'
                sh 'kubectl apply -f k8s/ingress.yaml'
                
                // 5. บังคับให้ Kubernetes ดึง Image ล่าสุดไปอัปเดต Pod ทันที ทั้งสองฝั่ง
                // (ถ้าคุณตั้งชื่อ deployment ของ backend เป็นอย่างอื่น อย่าลืมแก้บรรทัดนี้)
                sh 'kubectl rollout restart deployment/sut-attendance-frontend -n default'
                sh 'kubectl rollout restart deployment/backend-deployment -n default'
            }
        }

        stage('Clean Up') {
            steps {
                // 6. ลบขยะ Image ออกทั้งสองตัว
                sh "/usr/bin/docker rmi ${FRONTEND_IMAGE} || true"
                sh "/usr/bin/docker rmi ${BACKEND_IMAGE} || true"
            }
        }
    }

    post {
        always {
            sh '/usr/bin/docker logout || true'
        }
        success {
            echo '✅ อัปเดตระบบ SUT Attendance System ทั้ง Frontend และ Backend สำเร็จแล้ว!'
        }
        failure {
            echo '❌ ล้มเหลว กรุณาตรวจสอบ Log ใน Jenkins'
        }
    }
}