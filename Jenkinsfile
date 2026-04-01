pipeline {
    agent any

    environment {
        IMAGE_NAME = "monapp"
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Recuperation du code depuis GitHub...'
                checkout scm
            }
        }

        stage('Build Image Docker') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
            }
        }

        stage('Verification') {
            steps {
                sh "docker images ${IMAGE_NAME}"
            }
        }

        stage('Deploiement') {
            steps {
                sh 'docker stop monapp-container || true'
                sh 'docker rm monapp-container || true'
                sh 'docker run -d --name monapp-container --restart unless-stopped -p 8081:80 monapp:latest'
            }
        }
    }

    post {
        success {
            echo 'Deploiement reussi !'
        }
        failure {
            echo 'Echec du pipeline'
        }
    }
}
