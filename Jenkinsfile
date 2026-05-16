pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        FRONTEND_IMAGE = "sarayut1234/sut-attendance-frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE  = "sarayut1234/sut-attendance-backend:${BUILD_NUMBER}"
        DOCKER = '/usr/bin/docker'
    }

    stages {
        stage('Checkout Code') {
            steps {
                deleteDir()
                git branch: 'vm',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/SARAYUT1142/sut-attendance-system.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "/usr/bin/docker build --no-cache -t ${FRONTEND_IMAGE} ./frontend"
                sh "/usr/bin/docker build --no-cache -t ${BACKEND_IMAGE} ./backend"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | /usr/bin/docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh "/usr/bin/docker push ${FRONTEND_IMAGE}"
                sh "/usr/bin/docker push ${BACKEND_IMAGE}"
            }
        }

        // stage('Deploy to K8s') {
        //     steps {
        //         sh 'kubectl apply -f k8s/database/'
        //         sh 'kubectl apply -f k8s/backend/'
        //         sh 'kubectl apply -f k8s/frontend/'
        //         sh 'kubectl apply -f k8s/ingress.yaml'

        //         // ใช้ set image แทน rollout restart เพื่อบังคับ pull image ใหม่
        //         sh "kubectl set image deployment/sut-attendance-frontend frontend=${FRONTEND_IMAGE} -n default"
        //         sh "kubectl set image deployment/backend-deployment backend=${BACKEND_IMAGE} -n default"

        //         // รอให้ deploy เสร็จก่อน
        //         sh 'kubectl rollout status deployment/sut-attendance-frontend -n default'
        //         sh 'kubectl rollout status deployment/backend-deployment -n default'
        //     }
        // }

       stage('Deploy to Vagrant K3s') {
    steps {
        // ดึงกุญแจ k3s-config มาใช้งาน
        withCredentials([file(credentialsId: 'k3s-config', variable: 'KUBECONFIG')]) {
            
            // 1. สั่ง Apply ไฟล์ YAML ทั้งหมด
            sh 'kubectl --kubeconfig=$KUBECONFIG apply -f k8s/database/'
            sh 'kubectl --kubeconfig=$KUBECONFIG apply -f k8s/backend/'
            sh 'kubectl --kubeconfig=$KUBECONFIG apply -f k8s/frontend/'
            sh 'kubectl --kubeconfig=$KUBECONFIG apply -f k8s/ingress.yaml'

            // 2. ใช้ set image เพื่อบังคับดึง Image เวอร์ชันล่าสุดจาก Docker Hub
            sh "kubectl --kubeconfig=${KUBECONFIG} set image deployment/sut-attendance-frontend frontend=${FRONTEND_IMAGE} -n default"
            sh "kubectl --kubeconfig=${KUBECONFIG} set image deployment/backend-deployment backend=${BACKEND_IMAGE} -n default"

            // 3. รอเช็คสถานะจนกว่าจะพร้อมใช้งาน
            sh "kubectl --kubeconfig=${KUBECONFIG} rollout status deployment/sut-attendance-frontend -n default"
            sh "kubectl --kubeconfig=${KUBECONFIG} rollout status deployment/backend-deployment -n default"
        }
    }
}

        stage('Clean Up') {
            steps {
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
            echo '✅ อัปเดตระบบ SUT Attendance System สำเร็จแล้ว!'
        }
        failure {
            echo '❌ ล้มเหลว กรุณาตรวจสอบ Log ใน Jenkins'
        }
    }
}