pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKER_IMAGE = "sarayut1142/sut-attendance-frontend:latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/SARAYUT1142/sut-attendance-system.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                sh "docker push ${DOCKER_IMAGE}"
            }
        }

        stage('Clean Up') {
            steps {
                sh "docker rmi ${DOCKER_IMAGE} || true"
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
        success {
            echo '✅ สำเร็จ!'
        }
        failure {
            echo '❌ ล้มเหลว'
        }
    }
}
