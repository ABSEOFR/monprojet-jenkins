pipeline {
    agent any

    environment {
        IMAGE_NAME = "contacts-api"
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

        stage('Import image dans K3s') {
            steps {
                sh "docker save ${IMAGE_NAME}:latest | k3s ctr images import -"
            }
        }

        stage('Deploy sur Kubernetes') {
            steps {
                sh "kubectl rollout restart deployment contacts-api"
                sh "kubectl rollout status deployment contacts-api --timeout=60s"
            }
        }
    }

    post {
        success {
            echo 'Contacts API deployee avec succes sur Kubernetes !'
        }
        failure {
            echo 'Echec du pipeline'
        }
    }
}
