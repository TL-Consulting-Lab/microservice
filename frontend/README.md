# Frontend UI for Microservices

A simple web-based dashboard to interact with the microservices application.

## Features

- **Service Health Monitoring**: Real-time health status of all services
- **User Management**: Create and view users
- **Order Management**: Create and view orders  
- **API Testing Console**: Test custom API endpoints
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Option 1: Simple File Server (Recommended)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start a simple HTTP server:
   
   **Using Python:**
   ```bash
   python -m http.server 8080
   ```
   
   **Using Node.js (if you have http-server installed):**
   ```bash
   npx http-server -p 8080
   ```
   
   **Using PHP:**
   ```bash
   php -S localhost:8080
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

### Option 2: Open Directly in Browser

You can also open the `index.html` file directly in your browser, but you may encounter CORS issues when making API calls.

## Prerequisites

Make sure your microservices are running:

- API Gateway: http://localhost:3000
- User Service: http://localhost:3001  
- Order Service: http://localhost:3002

## Usage

### Service Health Status
- The dashboard automatically checks the health of all services on load
- Green badges indicate healthy services
- Red badges indicate offline or error states
- Click "Refresh Status" to manually update

### User Management
- **View Users**: Click "Get All Users" to fetch all users from the database
- **Create User**: Click "Create User" to open a form and add a new user

### Order Management  
- **View Orders**: Click "Get All Orders" to fetch all orders
- **Create Order**: Click "Create Order" to add a new order (requires valid User ID)

### API Testing Console
- Test any API endpoint manually
- Supports GET, POST, PUT, DELETE methods
- JSON request body support for POST/PUT requests
- View formatted responses with status codes

## API Endpoints

The frontend interacts with these API Gateway endpoints:

- `GET /health` - Gateway health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/orders` - Get all orders  
- `POST /api/orders` - Create new order

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Make sure you're serving the frontend from an HTTP server (not file://)
2. Verify the API Gateway has CORS enabled (it should be configured already)

### Service Unavailable
If services show as offline:
1. Check that all microservices are running on their expected ports
2. Verify the API Gateway is accessible at http://localhost:3000
3. Check the browser's developer console for detailed error messages

### API Calls Failing
1. Ensure the API Gateway routing is working properly
2. Check the network tab in browser developer tools
3. Verify request payloads are properly formatted JSON

## Browser Compatibility

This frontend uses modern web standards and is compatible with:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

The frontend consists of:
- `index.html` - Main dashboard interface
- `app.js` - JavaScript logic for API interactions
- Bootstrap 5 - UI framework
- Font Awesome - Icons

To modify the UI:
1. Edit `index.html` for layout changes
2. Edit `app.js` for functionality changes
3. Refresh the browser to see changes
