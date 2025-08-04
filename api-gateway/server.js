const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Service URLs from environment variables
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      userService: USER_SERVICE_URL,
      orderService: ORDER_SERVICE_URL
    }
  });
});

// Generic proxy function with error handling
const proxyRequest = async (req, res, serviceUrl, apiPrefix) => {
  try {
    // Construct the target URL - remove the /api prefix and map to service endpoint
    let targetPath = req.originalUrl;
    if (apiPrefix === '/api/users') {
      targetPath = req.originalUrl.replace('/api/users', '/users');
    } else if (apiPrefix === '/api/orders') {
      targetPath = req.originalUrl.replace('/api/orders', '/orders');
    }
    
    const response = await axios({
      method: req.method,
      url: `${serviceUrl}${targetPath}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      timeout: 10000 // 10 second timeout
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error proxying request to ${serviceUrl}:`, error.message);
    
    if (error.response) {
      // Service responded with error status
      res.status(error.response.status).json({
        error: error.response.data.error || 'Service error',
        service: serviceUrl
      });
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      // Service is down
      res.status(503).json({
        error: 'Service unavailable',
        message: 'The requested service is currently unavailable',
        service: serviceUrl
      });
    } else {
      // Other errors
      res.status(500).json({
        error: 'Gateway error',
        message: 'An error occurred while processing your request'
      });
    }
  }
};

// User service routes
app.all('/api/users*', (req, res) => {
  proxyRequest(req, res, USER_SERVICE_URL, '/api/users');
});

// Order service routes
app.all('/api/orders*', (req, res) => {
  proxyRequest(req, res, ORDER_SERVICE_URL, '/api/orders');
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Microservices API Gateway',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      orders: '/api/orders',
      health: '/health'
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: ['/api/users', '/api/orders', '/health']
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📍 User Service URL: ${USER_SERVICE_URL}`);
  console.log(`📍 Order Service URL: ${ORDER_SERVICE_URL}`);
  console.log(`🔗 Gateway URL: http://localhost:${PORT}`);
});
