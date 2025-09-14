#!/bin/bash

echo "🔨 Building and pushing Goal Tracker Docker image"
echo "================================================"

# Configuration
PROJECT_ID="rosy-slate-468308-r5"
IMAGE_NAME="goal-tracker"
COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
IMAGE_TAG="gcr.io/$PROJECT_ID/$IMAGE_NAME:$COMMIT_SHA"

echo "📦 Project ID: $PROJECT_ID"
echo "🏷️  Image: $IMAGE_TAG"
echo ""

# Authenticate with Google Cloud
echo "🔑 Authenticating with Google Cloud..."
gcloud auth configure-docker

# Build the image
echo "🔨 Building Docker image..."
docker build -t $IMAGE_TAG .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Push the image
echo "📤 Pushing image to Google Container Registry..."
docker push $IMAGE_TAG

if [ $? -ne 0 ]; then
    echo "❌ Docker push failed"
    exit 1
fi

echo "✅ Image pushed successfully: $IMAGE_TAG"
echo ""
echo "Now you can deploy to Kubernetes using:"
echo "1. Update k8s/deployment.yaml with image: $IMAGE_TAG"
echo "2. Run: kubectl apply -f k8s/"
