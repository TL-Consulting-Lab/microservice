# Microservices Application

A simple Node.js microservices application demonstrating service-oriented architecture with API Gateway, User Service, and Order Service.

## Project Overview

This project implements a microservices architecture with three core services:
- **API Gateway**: Central entry point that routes requests to appropriate services
- **User Service**: Manages user data and operations
- **Order Service**: Handles order management with user validation
- **Frontend UI**: Web dashboard for interacting with the services

## Project Structure

```
microservices/
├── api-gateway/          # API Gateway service
│   ├── package.json
│   ├── server.js
│   └── node_modules/
├── user-service/         # User management service
│   ├── package.json
│   ├── server.js
│   └── node_modules/
├── order-service/        # Order management service
│   ├── package.json
│   ├── server.js
│   └── node_modules/
├── frontend/             # Web UI dashboard
│   ├── index.html
│   ├── app.js
│   └── README.md
├── docker-compose.yml    # Docker configuration
└── README.md            # This file
```

## Services Overview

### API Gateway (Port 3000)
- Routes all client requests to appropriate services
- Handles CORS, rate limiting, and security
- Endpoints: `/api/users/*`, `/api/orders/*`, `/health`

### User Service (Port 3001)
- Manages user CRUD operations
- Validates user data with Joi
- Endpoints: `/users`, `/users/:id`, `/health`

### Order Service (Port 3002)
- Handles order management
- Validates user existence before creating orders
- Endpoints: `/orders`, `/orders/:id`, `/health`

### Frontend UI (Port 8080)
- Web dashboard for service interaction
- Real-time service health monitoring
- User and order management interface

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Install Dependencies

Each service has isolated dependencies. Install them separately:

```bash
# Install API Gateway dependencies
cd api-gateway
npm install

# Install User Service dependencies
cd ../user-service
npm install

# Install Order Service dependencies
cd ../order-service
npm install
### Start Services

Start each service in a separate terminal:

```bash
# Terminal 1: Start User Service
cd user-service
npm start

# Terminal 2: Start Order Service
cd order-service
npm start

# Terminal 3: Start API Gateway
cd api-gateway
npm start

# Terminal 4: Start Frontend (optional)
cd frontend
python -m http.server 8080
```

## Service Endpoints

### API Gateway (http://localhost:3000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Gateway health check |
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create new user |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/:id` | Get order by ID |
| PUT | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |

### User Service (http://localhost:3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health check |
| GET | `/users` | Get all users |
| POST | `/users` | Create new user |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### Order Service (http://localhost:3002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health check |
| GET | `/orders` | Get all orders |
| POST | `/orders` | Create new order |
| GET | `/orders/:id` | Get order by ID |
| PUT | `/orders/:id` | Update order |
| DELETE | `/orders/:id` | Delete order |

## API Usage Examples

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "product": "Laptop",
    "quantity": 1,
    "price": 999.99
  }'
```

### Get All Orders
```bash
curl http://localhost:3000/api/orders
```

## Using the Frontend UI

1. Start all services as described above
2. Start the frontend server:
   ```bash
   cd frontend
   python -m http.server 8080
   ```
3. Open http://localhost:8080 in your browser
4. Use the dashboard to:
   - Monitor service health
   - Create and view users
   - Create and view orders
   - Test custom API endpoints

## Testing Service Health

Check if all services are running:

```bash
# Check API Gateway
curl http://localhost:3000/health

# Check User Service
curl http://localhost:3001/health

# Check Order Service
curl http://localhost:3002/health
```

## Docker Support

Run all services with Docker Compose:

```bash
docker-compose up -d
```

## Troubleshooting

### Port Conflicts
If ports are already in use, kill existing Node.js processes:
```bash
# Windows PowerShell
Get-Process -Name node | Stop-Process -Force

# Linux/Mac
pkill node
```

### Service Communication Issues
- Ensure all services are running on their expected ports
- Check firewall settings if services can't communicate
- Verify API Gateway routing configuration

### CORS Issues
- Use the frontend HTTP server instead of opening HTML files directly
- Check that CORS is enabled in the API Gateway

## Architecture Benefits

- **Isolation**: Each service has its own dependencies and can be deployed independently
- **Scalability**: Services can be scaled individually based on demand
- **Maintainability**: Clear separation of concerns makes code easier to maintain
- **Technology Flexibility**: Each service can use different technologies if needed

## Next Steps

- Add authentication and authorization
- Implement service discovery
- Add monitoring and logging
- Set up CI/CD pipelines
- Add database persistence
- Implement API versioning

3. Or use the automated PowerShell script:
```powershell
# Installs all dependencies and starts services with isolation
.\start-dev.ps1
```

## API Endpoints

### Through API Gateway (http://localhost:3000)

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get orders by user ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Direct Service Access

#### User Service (http://localhost:3001)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Order Service (http://localhost:3002)
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `GET /orders/user/:userId` - Get orders by user ID
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

## Example API Calls

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "age": 30}'
```

### Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "product": "Laptop", "quantity": 1, "price": 999.99}'
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Get Orders for a User
```bash
curl http://localhost:3000/api/orders/user/1
```

## Sample Data

The application comes with pre-loaded sample data:

### Users
- John Doe (john@example.com)
- Jane Smith (jane@example.com)
- Bob Johnson (bob@example.com)

### Orders
- Various orders linked to the sample users

## Error Handling

- **400**: Bad Request - Invalid input data
- **404**: Not Found - Resource doesn't exist
- **500**: Internal Server Error - Server-side errors
- **503**: Service Unavailable - When dependent services are down

## Environment Variables

### API Gateway
- `USER_SERVICE_URL`: URL of the User Service
- `ORDER_SERVICE_URL`: URL of the Order Service
- `PORT`: Gateway port (default: 3000)

### User Service
- `PORT`: Service port (default: 3001)
- `NODE_ENV`: Environment (development/production)

### Order Service
- `PORT`: Service port (default: 3002)
- `USER_SERVICE_URL`: URL of the User Service for validation
- `NODE_ENV`: Environment (development/production)

## Development

Each service is independently developed and can be scaled separately. Services communicate via HTTP REST APIs.

## Future Enhancements

- Add database persistence (MongoDB, PostgreSQL)
- Implement authentication and authorization
- Add API documentation with Swagger
- Implement service mesh for better communication
- Add monitoring and logging
- Implement circuit breaker pattern
- Add unit and integration tests
