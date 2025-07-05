pipeline {
    agent any
    environment {
        FULL_IMAGE = "909927813182.dkr.ecr.ap-southeast-1.amazonaws.com/devops-final-assignment-1-frontend:latest"
        TASK_FAMILY = "frontend-task-definition"
        CLUSTER_NAME = "final-assignment-ecs-cluster"
        SERVICE_NAME = "final-assignment-fe"
        REGION = "ap-southeast-1"
    }

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t devops-final-assignment-1-frontend:latest .'
            }
        }

        stage('Upload image to ECR') {
            steps {
                sh """
                    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin 909927813182.dkr.ecr.ap-southeast-1.amazonaws.com
                    docker tag devops-final-assignment-1-frontend:latest $FULL_IMAGE
                    docker push $FULL_IMAGE
                """
            }
        }

        stage('Update ECS task and deploy') {
            steps {
                sh """
                    echo "Describing current task definition..."
                    TASK_DEF_JSON=\$(aws ecs describe-task-definition --task-definition $TASK_FAMILY --region $REGION)

                    echo "Creating new task definition..."
                    NEW_TASK_DEF=\$(echo \$TASK_DEF_JSON | jq --arg IMAGE "$FULL_IMAGE" '
                        .taskDefinition |
                        .containerDefinitions[0].image = \$IMAGE |
                        del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)
                    ')

                    echo "Registering new task definition..."
                    REGISTERED_DEF=\$(aws ecs register-task-definition --region $REGION --cli-input-json "\$NEW_TASK_DEF")

                    REVISION=\$(echo \$REGISTERED_DEF | jq -r '.taskDefinition.revision')

                    echo "Updating ECS service..."
                    aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --task-definition $TASK_FAMILY:\$REVISION --force-new-deployment
                """
            }
        }
    }
}
