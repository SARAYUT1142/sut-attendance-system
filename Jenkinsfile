pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKER_IMAGE = "sarayut1142/sut-attendance-frontend:latest"
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

        stage('Build Docker Image') {
            steps {
                sh "${DOCKER} build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh "echo $DOCKERHUB_CREDENTIALS_PSW | ${DOCKER} login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                sh "${DOCKER} push ${DOCKER_IMAGE}"
            }
        }

        stage('Clean Up') {
            steps {
                sh "${DOCKER} rmi ${DOCKER_IMAGE} || true"
            }
        }
    }

    post {
        always {
            sh "${DOCKER} logout || true"
        }
        success {
            echo '✅ สำเร็จ!'
        }
        failure {
            echo '❌ ล้มเหลว'
        }
    }
}
