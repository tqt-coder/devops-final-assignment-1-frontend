pipeline {
    agent any

    environment {
        AWS_REGION = "ap-southeast-1"
        ECR_REGISTRY = "909927813182.dkr.ecr.ap-southeast-1.amazonaws.com"
        IMAGE_NAME = "devops-final-assignment-1-frontend"
        FULL_IMAGE = "${ECR_REGISTRY}/${IMAGE_NAME}:latest"

        TASK_FAMILY = "frontend-task-definition"
        CLUSTER_NAME = "final-assignment-ecs-cluster"
        SERVICE_NAME = "final-assignment-fe"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Authenticate & Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    docker tag ${IMAGE_NAME}:latest ${FULL_IMAGE}
                    docker push ${FULL_IMAGE}
                '''
            }
        }

        stage('Update ECS Task Definition & Deploy') {
            steps {
                sh '''
                    echo "Fetching current task definition..."
                    TASK_DEF_JSON=$(aws ecs describe-task-definition --task-definition ${TASK_FAMILY} --region ${AWS_REGION})

                    echo "Creating new task definition with updated image..."
                    NEW_DEF=$(echo $TASK_DEF_JSON | jq --arg IMAGE "${FULL_IMAGE}" '
                        .taskDefinition |
                        .containerDefinitions[0].image = $IMAGE |
                        del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)
                    ')

                    echo "Registering new task definition..."
                    REGISTER_OUTPUT=$(aws ecs register-task-definition \
                        --region ${AWS_REGION} \
                        --cli-input-json "$NEW_DEF")

                    REVISION=$(echo $REGISTER_OUTPUT | jq -r '.taskDefinition.revision')

                    echo "Updating ECS service to new revision..."
                    aws ecs update-service \
                        --region ${AWS_REGION} \
                        --cluster ${CLUSTER_NAME} \
                        --service ${SERVICE_NAME} \
                        --task-definition ${TASK_FAMILY}:${REVISION} \
                        --force-new-deployment
                '''
            }
        }
    }
}
