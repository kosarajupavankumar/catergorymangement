# CI/CD Pipeline Setup

This repository contains the configuration for setting up a CI/CD pipeline using GitHub Actions to deploy the application to a Kubernetes cluster.

## Prerequisites

- Docker installed on your local machine.
- Kubernetes installed and configured on your local machine (Minikube or Docker Desktop with Kubernetes enabled).
- Helm installed on your local machine.
- GitHub repository with the necessary files (`Dockerfile`, `k8s/deployment.yaml`, `k8s/service.yaml`).

## Setting Up GitHub Actions

1. **Create a GitHub Actions Workflow File**

   Create a file named `ci-cd.yml` in the `.github/workflows` directory of your repository with the following content:

   ```yaml
   name: CI/CD Pipeline

   on:
     push:
       branches:
         - main
     pull_request:
       branches:
         - main
     workflow_dispatch:

   jobs:
     build:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout repository
           uses: actions/checkout@v2

         - name: Set up Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '14'

         - name: Install dependencies
           run: npm install

         - name: Run tests
           run: npm test

         - name: Build application
           run: npm run build

         - name: Build Docker image
           run: docker build -t category-api:latest .

         - name: Log in to Docker Hub
           run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

         - name: Push Docker image to Docker Hub
           run: docker push ${{ secrets.DOCKER_USERNAME }}/category-api:latest

     deploy:
       runs-on: ubuntu-latest
       needs: build

       steps:
         - name: Checkout repository
           uses: actions/checkout@v2

         - name: Set up kubectl
           uses: azure/setup-kubectl@v1
           with:
             version: 'latest'

         - name: Set up Helm
           uses: azure/setup-helm@v1
           with:
             version: 'latest'

         - name: Deploy to Kubernetes
           run: |
             kubectl apply -f k8s/deployment.yaml
             kubectl apply -f k8s/service.yaml

         - name: Rollback on failure
           if: failure()
           run: helm rollback category-api
   ```

2. **Configure Secrets for MongoDB URI**

   Follow these steps to configure secrets for MongoDB URI in GitHub Actions:

   - Navigate to your GitHub repository on the GitHub website.
   - Click on the "Settings" tab.
   - In the left sidebar, click on "Secrets and variables" and then "Actions".
   - Click the "New repository secret" button.
   - In the "Name" field, enter `MONGO_URI`.
   - In the "Value" field, enter your MongoDB URI (e.g., `mongodb+srv://admin:admin@cluster0.w0f47va.mongodb.net/?retryWrites=true&w=majority`).
   - Click the "Add secret" button to save the secret.

   This will securely store your MongoDB URI as a secret in your GitHub repository, which can then be accessed in your GitHub Actions workflows. The secret can be referenced in your workflow files using `${{ secrets.MONGO_URI }}`.

   For example, in your GitHub Actions workflow file located in `.github/workflows`, you can use the secret as follows:

   ```yaml
   env:
     MONGO_URI: ${{ secrets.MONGO_URI }}
   ```

## Running the Application Using Docker Compose

1. **Create a `docker-compose.yml` File**

   Create a file named `docker-compose.yml` in the root of your repository with the following content:

   ```yaml
   version: '3.8'

   services:
     category-api:
       build: .
       ports:
         - '5000:5000'
       environment:
         - MONGO_URI=${MONGO_URI}
   ```

2. **Run the Application**

   Use the following command to run the application using Docker Compose:

   ```sh
   docker-compose up
   ```

   This will build the Docker image and start the application container, exposing it on port 5000.

## Testing the CI/CD Pipeline Locally

To test the CI/CD pipeline locally, follow these steps:

1. Ensure you have Docker installed on your local machine.
2. Ensure you have Kubernetes installed and configured on your local machine. You can use Minikube or Docker Desktop with Kubernetes enabled.
3. Ensure you have Helm installed on your local machine.
4. Create a local Docker image of your application using the `Dockerfile` in the root of your repository. You can use the following command:
   ```sh
   docker build -t category-api:latest .
   ```
5. Create a Kubernetes secret for your MongoDB URI. You can use the following command:
   ```sh
   kubectl create secret generic mongo-secret --from-literal=mongo-uri="your-mongodb-uri"
   ```
6. Deploy your application to your local Kubernetes cluster using the Kubernetes deployment and service YAML files located in the `k8s` directory. You can use the following commands:
   ```sh
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```
7. Verify that your application is running correctly in your local Kubernetes cluster. You can use the following command to check the status of your pods:
   ```sh
   kubectl get pods
   ```
8. Test your application by sending requests to the service. You can use a tool like `curl` or Postman to send requests to the service URL. The service URL can be obtained using the following command:
   ```sh
   kubectl get svc
   ```
9. If you encounter any issues, you can check the logs of your pods using the following command:
   ```sh
   kubectl logs <pod-name>
   ```
10. To handle rollbacks in case of deployment failure, you can use Helm. Create a Helm chart for your application and use Helm to deploy and manage your application. Helm provides built-in support for rollbacks, allowing you to easily revert to a previous release in case of deployment failure. You can use the following commands to deploy your application using Helm:
    ```sh
    helm install category-api ./helm-chart
    ```
    To rollback to a previous release, you can use the following command:
    ```sh
    helm rollback category-api <revision>
    ```

## Conclusion

By following the steps outlined in this document, you can set up a CI/CD pipeline using GitHub Actions to automate the testing and deployment of your application to a Kubernetes cluster. This setup ensures that your application is continuously tested and deployed, providing a streamlined and efficient development workflow.
