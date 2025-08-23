
---

```
# 1️⃣ Start Minikube with Docker driver
minikube start --driver=docker
# Starts a local Kubernetes cluster using Docker as the virtualization driver, create one node which act like master node and worker node

minikube start --driver=docker --nodes=4 
#create 1 MN + 3 WN

minikube node add --worker
# Add 1 WN

# 2️⃣ Stop Minikube
minikube stop
# Stops the Minikube cluster (container stops but not deleted)

# 3️⃣ Delete Minikube
minikube delete
# Completely deletes the Minikube cluster and all data

# 4️⃣ Check Minikube status
minikube status
# Shows the status of the Minikube cluster components

# 5️⃣ Get Kubernetes cluster info
kubectl cluster-info
# Shows info about Kubernetes master and services

# 6️⃣ Get nodes in the cluster
kubectl get nodes
# Lists all nodes in the cluster (usually just 'minikube' for local)

# 7️⃣ Get all pods in all namespaces
kubectl get pods -A
# Lists all pods running in every namespace

# 8️⃣ Describe a specific pod
kubectl describe pod <pod-name>
# Shows detailed info about a pod (events, status, containers)

# 9️⃣ Check logs of a pod
kubectl logs <pod-name>
# Shows logs from the main container of the pod

# 10️⃣ Open Minikube Kubernetes dashboard
minikube dashboard
# Opens a browser GUI to visualize cluster, pods, services

# 11️⃣ SSH into Minikube VM / container
minikube ssh
# Gives terminal access to the Minikube instance itself

# 12️⃣ Expose a service / pod to access from host
kubectl port-forward <pod-name> <local-port>:<pod-port>
# For example: kubectl port-forward mypod 8080:80
# Lets you access pod service on localhost:8080

# 13️⃣ Enable Minikube addons (like metrics, ingress)
minikube addons list
# Lists all available addons
minikube addons enable <addon-name>
# Enables an addon, e.g., metrics-server, ingress

# 14️⃣ Check cluster IP / service URL
minikube service <service-name> --url
# Gives a URL to access the service running inside Minikube

# 15️⃣ Stop and start Minikube quickly (without deleting)
minikube pause
# Pauses the cluster (saves state)
minikube unpause
# Resumes the cluster

```