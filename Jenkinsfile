pipeline {
    agent any

    environment {
        IMAGE_NAME = "contacts-api"
        IMAGE_TAG  = "${BUILD_NUMBER}"
        PORT       = "3000"
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
                sh 'docker stop contacts-api || true'
                sh 'docker rm contacts-api || true'
                sh 'docker run -d --name contacts-api --restart unless-stopped -p 3000:3000 contacts-api:latest'
            }
        }
    }

    post {
        success {
            echo 'Contacts API deployee avec succes sur le port 3000 !'
        }
        failure {
            echo 'Echec du pipeline'
        }
    }
}
