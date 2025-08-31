
---

```
minikube addons enable dashboard
minikube addons enable metrics-server   # optional but useful for monitoring
kubectl -n kubernetes-dashboard get svc
kubectl -n kubernetes-dashboard port-forward --address 0.0.0.0 svc/kubernetes-dashboard 8080:80
```