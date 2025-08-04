# API Testing Examples

This file contains example API calls to test the microservices application.

## Prerequisites

Make sure the application is running:
```bash
docker-compose up --build
```

Or start services manually (each with isolated dependencies):
```bash
# Each service has its own node_modules and package.json

# Terminal 1 - User Service
cd user-service && npm install && npm start

# Terminal 2 - Order Service  
cd order-service && npm install && npm start

# Terminal 3 - API Gateway
cd api-gateway && npm install && npm start
```

Or use the automated script:
```powershell
# Windows - starts all services with isolated dependencies
.\start-dev.ps1
```

## Health Checks

### Check API Gateway
```bash
curl http://localhost:3000/health
```

### Check User Service
```bash
curl http://localhost:3001/health
```

### Check Order Service
```bash
curl http://localhost:3002/health
```

## User Service APIs

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Get User by ID
```bash
curl http://localhost:3000/api/users/1
```

### Create New User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Williams",
    "email": "alice@example.com",
    "age": 25
  }'
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "age": 31
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/3
```

## Order Service APIs

### Get All Orders
```bash
curl http://localhost:3000/api/orders
```

### Get Orders with Filters
```bash
# Filter by status
curl "http://localhost:3000/api/orders?status=pending"

# Filter by user ID
curl "http://localhost:3000/api/orders?userId=1"

# Multiple filters
curl "http://localhost:3000/api/orders?status=pending&userId=1"
```

### Get Order by ID
```bash
curl http://localhost:3000/api/orders/1
```

### Get Orders by User ID
```bash
curl http://localhost:3000/api/orders/user/1
```

### Create New Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "product": "Smartphone",
    "quantity": 1,
    "price": 699.99
  }'
```

### Update Order
```bash
curl -X PUT http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing",
    "quantity": 2
  }'
```

### Delete Order
```bash
curl -X DELETE http://localhost:3000/api/orders/4
```

## Error Scenarios

### Invalid User ID
```bash
curl http://localhost:3000/api/users/999
```

### Invalid Data
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "invalid-email",
    "age": -5
  }'
```

### Create Order with Invalid User
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 999,
    "product": "Test Product",
    "quantity": 1,
    "price": 10.00
  }'
```

## Batch Testing Script

### Windows PowerShell
```powershell
# Test all endpoints
Write-Host "Testing API Gateway Health..."
Invoke-RestMethod http://localhost:3000/health

Write-Host "Testing Users..."
Invoke-RestMethod http://localhost:3000/api/users

Write-Host "Testing Orders..."
Invoke-RestMethod http://localhost:3000/api/orders

Write-Host "Creating new user..."
$userBody = @{
    name = "Test User"
    email = "test@example.com"
    age = 30
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/users -Method POST -Body $userBody -ContentType "application/json"
```

### Bash (Linux/Mac)
```bash
#!/bin/bash

echo "Testing API Gateway Health..."
curl -s http://localhost:3000/health | jq

echo "Testing Users..."
curl -s http://localhost:3000/api/users | jq

echo "Testing Orders..."
curl -s http://localhost:3000/api/orders | jq

echo "Creating new user..."
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "age": 30}' | jq
```

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Validation Error Response
```json
{
  "success": false,
  "error": "Validation error",
  "details": ["Field 'name' is required", "Email format is invalid"]
}
```
