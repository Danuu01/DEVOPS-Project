# 🚀 Kubernetes Deployment for Goal Tracker

This directory contains all the necessary Kubernetes manifests to deploy the Goal Tracker application to a Kubernetes cluster.

## 📁 Files Overview

- `deployment.yaml` - Main application deployment with 2 replicas
- `service.yaml` - Internal service for pod communication
- `ingress.yaml` - External access configuration (optional)
- `pvc.yaml` - Persistent volume claims for data storage
- `configmap.yaml` - Environment variables configuration
- `deploy.sh` - Automated deployment script

## 🚀 Quick Deployment

### Prerequisites

1. **Kubernetes cluster** (GKE, EKS, AKS, or local like minikube)
2. **kubectl** configured to connect to your cluster
3. **Docker image** built and available in your cluster's registry

### Step 1: Build and Push Docker Image

```bash
# Build the image
docker build -t goal-tracker:latest .

# Tag for your registry (replace with your actual registry)
docker tag goal-tracker:latest gcr.io/your-project/goal-tracker:latest

# Push to registry
docker push gcr.io/your-project/goal-tracker:latest
```

### Step 2: Update Image Reference

Edit `deployment.yaml` and update the image reference:

```yaml
containers:
- name: goal-tracker
  image: gcr.io/your-project/goal-tracker:latest  # Update this line
```

### Step 3: Deploy

```bash
# Make the script executable (if not already done)
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

## 🔧 Manual Deployment

If you prefer to deploy manually:

```bash
# Create namespace
kubectl create namespace goal-tracker

# Apply manifests
kubectl apply -f configmap.yaml -n goal-tracker
kubectl apply -f pvc.yaml -n goal-tracker
kubectl apply -f deployment.yaml -n goal-tracker
kubectl apply -f service.yaml -n goal-tracker
kubectl apply -f ingress.yaml -n goal-tracker
```

## 🌐 Accessing the Application

### Option 1: Port Forward (for testing)
```bash
kubectl port-forward svc/goal-tracker-service 3000:80 -n goal-tracker
# Then visit: http://localhost:3000
```

### Option 2: LoadBalancer Service
Change the service type in `service.yaml`:
```yaml
spec:
  type: LoadBalancer  # Change from ClusterIP
```

### Option 3: Ingress (for production)
1. Update the host in `ingress.yaml` with your domain
2. Ensure you have an ingress controller installed
3. Configure DNS to point to your ingress controller

## 📊 Monitoring and Management

### View Application Status
```bash
# Check pods
kubectl get pods -n goal-tracker

# Check services
kubectl get svc -n goal-tracker

# Check ingress
kubectl get ingress -n goal-tracker
```

### View Logs
```bash
# Application logs
kubectl logs -f deployment/goal-tracker -n goal-tracker

# All pods logs
kubectl logs -f -l app=goal-tracker -n goal-tracker
```

### Scale Application
```bash
# Scale to 3 replicas
kubectl scale deployment goal-tracker --replicas=3 -n goal-tracker
```

### Update Application
```bash
# Update image
kubectl set image deployment/goal-tracker goal-tracker=gcr.io/your-project/goal-tracker:v2.0 -n goal-tracker

# Check rollout status
kubectl rollout status deployment/goal-tracker -n goal-tracker
```

## 🔧 Configuration

### Environment Variables
Edit `configmap.yaml` to add or modify environment variables:

```yaml
data:
  NODE_ENV: "production"
  PORT: "3000"
  # Add your custom variables here
```

### Resource Limits
Adjust CPU and memory limits in `deployment.yaml`:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Storage
Modify `pvc.yaml` to adjust storage requirements:

```yaml
resources:
  requests:
    storage: 1Gi  # Increase as needed
```

## 🛠️ Troubleshooting

### Common Issues

1. **Image pull errors**: Ensure your image is available in the cluster's registry
2. **Pod stuck in Pending**: Check resource availability and PVC status
3. **Service not accessible**: Verify service selector matches pod labels
4. **Ingress not working**: Check ingress controller and DNS configuration

### Debug Commands

```bash
# Describe pod for detailed info
kubectl describe pod <pod-name> -n goal-tracker

# Check events
kubectl get events -n goal-tracker --sort-by='.lastTimestamp'

# Check persistent volumes
kubectl get pv,pvc -n goal-tracker
```

## 🗑️ Cleanup

To remove the deployment:

```bash
# Delete all resources
kubectl delete namespace goal-tracker

# Or delete individual resources
kubectl delete -f . -n goal-tracker
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Persistent Volumes Guide](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
