pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKER_IMAGE = "sarayut12134/sut-attendance-frontend:latest"
        DOCKER = '/usr/bin/docker'
    }

    stages {
        stage('Checkout Code') {
            steps {
                deleteDir()
                git branch: 'main',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/SARAYUT1234/sut-attendance-system.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "/usr/bin/docker build -t ${DOCKER_IMAGE} ./frontend"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | /usr/bin/docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh "/usr/bin/docker push ${DOCKER_IMAGE}"
            }
        }

        stage('Deploy to K8s') {
            steps {
                // 1. สั่ง Apply ไฟล์ทั้งหมดในโฟลเดอร์ k8s/frontend/
                sh 'kubectl apply -f k8s/frontend/'
                
                // 2. บังคับให้ Kubernetes ดึง Image ล่าสุดไปอัปเดต Pod ทันที
                sh 'kubectl rollout restart deployment/sut-attendance-frontend -n default'
            }
        }

        stage('Clean Up') {
            steps {
                sh "/usr/bin/docker rmi ${DOCKER_IMAGE} || true"
            }
        }
    }

    post {
        always {
            sh '/usr/bin/docker logout || true'
        }
        success {
            echo '✅ สำเร็จ!'
        }
        failure {
            echo '❌ ล้มเหลว'
        }
    }
}
