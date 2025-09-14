#!/bin/bash

echo "🚀 Deploying Goal Tracker to Google Kubernetes Engine (GKE)"
echo "=========================================================="

# Configuration - UPDATE THESE VALUES
PROJECT_ID="rosy-slate-468308-r5"  # Your project ID
CLUSTER_NAME="your-cluster-name"   # Your GKE cluster name
CLUSTER_ZONE="us-central1-a"       # Your cluster zone
IMAGE_NAME="goal-tracker"

# Get the current commit SHA for tagging
COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
IMAGE_TAG="gcr.io/$PROJECT_ID/$IMAGE_NAME:$COMMIT_SHA"

echo "📦 Project ID: $PROJECT_ID"
echo "🏷️  Image: $IMAGE_TAG"
echo ""

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    echo "   Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with gcloud. Please run: gcloud auth login"
    exit 1
fi

# Set the project
echo "🔧 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Configure Docker to use gcloud as a credential helper
echo "🐳 Configuring Docker authentication..."
gcloud auth configure-docker

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t $IMAGE_TAG .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Push the image to Google Container Registry
echo "📤 Pushing image to Google Container Registry..."
docker push $IMAGE_TAG

if [ $? -ne 0 ]; then
    echo "❌ Docker push failed"
    exit 1
fi

# Get GKE credentials
echo "🔑 Getting GKE credentials..."
gcloud container clusters get-credentials $CLUSTER_NAME --zone $CLUSTER_ZONE

if [ $? -ne 0 ]; then
    echo "❌ Failed to get GKE credentials. Please check:"
    echo "   - Cluster name: $CLUSTER_NAME"
    echo "   - Zone: $CLUSTER_ZONE"
    echo "   - Cluster exists and is running"
    exit 1
fi

# Update the deployment with the new image
echo "📝 Updating Kubernetes deployment..."
sed -i.bak "s|image: goal-tracker:latest|image: $IMAGE_TAG|g" k8s/deployment.yaml

# Apply the Kubernetes manifests
echo "🚀 Deploying to Kubernetes..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/goal-tracker

# Show status
echo ""
echo "📊 Deployment Status:"
kubectl get pods
kubectl get services
kubectl get ingress

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "To access your application:"
echo "1. Port forward: kubectl port-forward svc/goal-tracker-service 3000:80"
echo "2. Then visit: http://localhost:3000"
echo ""
echo "To view logs: kubectl logs -f deployment/goal-tracker"
