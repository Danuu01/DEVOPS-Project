#!/bin/bash

echo "🚀 Deploying Goal Tracker to Kubernetes..."
echo "=========================================="

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    echo "   Visit: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# Check if we can connect to the cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

echo "✅ Connected to Kubernetes cluster"

# Create namespace (optional, you can use default)
NAMESPACE="goal-tracker"
echo "📦 Creating namespace: $NAMESPACE"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Apply all manifests
echo "📋 Applying Kubernetes manifests..."

echo "  - ConfigMap..."
kubectl apply -f configmap.yaml -n $NAMESPACE

echo "  - PersistentVolumeClaims..."
kubectl apply -f pvc.yaml -n $NAMESPACE

echo "  - Deployment..."
kubectl apply -f deployment.yaml -n $NAMESPACE

echo "  - Service..."
kubectl apply -f service.yaml -n $NAMESPACE

echo "  - Ingress (optional)..."
kubectl apply -f ingress.yaml -n $NAMESPACE

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/goal-tracker -n $NAMESPACE

# Show status
echo ""
echo "📊 Deployment Status:"
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "To access your application:"
echo "1. Check the service: kubectl get svc -n $NAMESPACE"
echo "2. Port forward for testing: kubectl port-forward svc/goal-tracker-service 3000:80 -n $NAMESPACE"
echo "3. Then visit: http://localhost:3000"
echo ""
echo "To view logs: kubectl logs -f deployment/goal-tracker -n $NAMESPACE"
echo "To scale: kubectl scale deployment goal-tracker --replicas=3 -n $NAMESPACE"
