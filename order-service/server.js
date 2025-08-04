const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3002;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// In-memory data store (replace with database in production)
let orders = [
  {
    id: 1,
    userId: 1,
    product: 'Laptop',
    quantity: 1,
    price: 999.99,
    totalAmount: 999.99,
    status: 'pending',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    userId: 1,
    product: 'Mouse',
    quantity: 2,
    price: 25.50,
    totalAmount: 51.00,
    status: 'completed',
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-17').toISOString()
  },
  {
    id: 3,
    userId: 2,
    product: 'Keyboard',
    quantity: 1,
    price: 75.00,
    totalAmount: 75.00,
    status: 'shipped',
    createdAt: new Date('2024-01-18').toISOString(),
    updatedAt: new Date('2024-01-19').toISOString()
  },
  {
    id: 4,
    userId: 3,
    product: 'Monitor',
    quantity: 1,
    price: 299.99,
    totalAmount: 299.99,
    status: 'pending',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString()
  }
];

let nextOrderId = 5;

// Validation schemas
const orderSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  product: Joi.string().min(1).max(200).required(),
  quantity: Joi.number().integer().positive().required(),
  price: Joi.number().positive().precision(2).required()
});

const updateOrderSchema = Joi.object({
  product: Joi.string().min(1).max(200),
  quantity: Joi.number().integer().positive(),
  price: Joi.number().positive().precision(2),
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed')
}).min(1);

// Helper function to find order by ID
const findOrderById = (id) => {
  return orders.find(order => order.id === parseInt(id));
};

// Helper function to validate user exists
const validateUserExists = async (userId) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`, {
      timeout: 5000
    });
    return response.status === 200 && response.data.success;
  } catch (error) {
    console.error(`Error validating user ${userId}:`, error.message);
    return false;
  }
};

// Helper function to calculate total amount
const calculateTotalAmount = (quantity, price) => {
  return Math.round(quantity * price * 100) / 100; // Round to 2 decimal places
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'order-service',
    timestamp: new Date().toISOString(),
    ordersCount: orders.length,
    userServiceUrl: USER_SERVICE_URL
  });
});

// GET /orders - Get all orders
app.get('/orders', (req, res) => {
  try {
    const { status, userId } = req.query;
    let filteredOrders = [...orders];

    // Filter by status if provided
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Filter by userId if provided
    if (userId) {
      const userIdNum = parseInt(userId);
      if (!isNaN(userIdNum)) {
        filteredOrders = filteredOrders.filter(order => order.userId === userIdNum);
      }
    }

    res.json({
      success: true,
      data: filteredOrders,
      count: filteredOrders.length,
      filters: { status, userId }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /orders/:id - Get order by ID
app.get('/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }

    const order = findOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /orders/user/:userId - Get orders by user ID
app.get('/orders/user/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    const userOrders = orders.filter(order => order.userId === userId);

    res.json({
      success: true,
      data: userOrders,
      count: userOrders.length,
      userId: userId
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /orders - Create new order
app.post('/orders', async (req, res) => {
  try {
    const { error, value } = orderSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Validate that user exists
    const userExists = await validateUserExists(value.userId);
    if (!userExists) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        message: 'The specified user does not exist'
      });
    }

    const totalAmount = calculateTotalAmount(value.quantity, value.price);

    const newOrder = {
      id: nextOrderId++,
      ...value,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);

    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /orders/:id - Update order
app.put('/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }

    const order = findOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const { error, value } = updateOrderSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Update order properties
    Object.assign(order, value);
    
    // Recalculate total amount if quantity or price changed
    if (value.quantity !== undefined || value.price !== undefined) {
      order.totalAmount = calculateTotalAmount(order.quantity, order.price);
    }
    
    order.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /orders/:id - Delete order
app.delete('/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }

    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const deletedOrder = orders.splice(orderIndex, 1)[0];

    res.json({
      success: true,
      data: deletedOrder,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Order Service API',
    version: '1.0.0',
    endpoints: {
      getAllOrders: 'GET /orders',
      getOrderById: 'GET /orders/:id',
      getOrdersByUser: 'GET /orders/user/:userId',
      createOrder: 'POST /orders',
      updateOrder: 'PUT /orders/:id',
      deleteOrder: 'DELETE /orders/:id',
      health: 'GET /health'
    },
    queryParameters: {
      orders: '?status=pending&userId=1'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
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
  console.log(`📦 Order Service running on port ${PORT}`);
  console.log(`🔗 Service URL: http://localhost:${PORT}`);
  console.log(`👤 User Service URL: ${USER_SERVICE_URL}`);
  console.log(`📊 Initial orders count: ${orders.length}`);
});
