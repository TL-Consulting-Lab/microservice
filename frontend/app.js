// API Gateway URL
const API_BASE_URL = 'http://localhost:3000';

// Utility function to display response
function displayResponse(elementId, data, isError = false) {
    const element = document.getElementById(elementId);
    const dataElement = document.getElementById(elementId.replace('-response', '-data'));
    
    element.style.display = 'block';
    element.className = `api-response p-3 ${isError ? 'border-danger' : 'border-success'}`;
    dataElement.textContent = JSON.stringify(data, null, 2);
}

// Utility function to show loading state
function showLoading(buttonElement) {
    const originalHTML = buttonElement.innerHTML;
    buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Loading...';
    buttonElement.disabled = true;
    
    return () => {
        buttonElement.innerHTML = originalHTML;
        buttonElement.disabled = false;
    };
}

// Health check functions
async function checkServiceHealth(serviceUrl, elementId) {
    try {
        const response = await fetch(serviceUrl);
        const data = await response.json();
        
        const element = document.getElementById(elementId);
        if (response.ok) {
            element.className = 'badge bg-success';
            element.textContent = 'Healthy';
        } else {
            element.className = 'badge bg-danger';
            element.textContent = 'Error';
        }
        return true;
    } catch (error) {
        const element = document.getElementById(elementId);
        element.className = 'badge bg-danger';
        element.textContent = 'Offline';
        return false;
    }
}

async function checkAllHealth() {
    const gatewayHealthy = await checkServiceHealth(`${API_BASE_URL}/health`, 'gateway-health');
    await checkServiceHealth(`${API_BASE_URL}/api/users`, 'user-health');
    await checkServiceHealth(`${API_BASE_URL}/api/orders`, 'order-health');
    
    // Update navbar status
    const navStatus = document.getElementById('gateway-status');
    if (gatewayHealthy) {
        navStatus.className = 'badge bg-success';
        navStatus.textContent = 'Online';
    } else {
        navStatus.className = 'badge bg-danger';
        navStatus.textContent = 'Offline';
    }
}

// User Management Functions
async function getAllUsers() {
    const button = event.target;
    const resetLoading = showLoading(button);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        const data = await response.json();
        
        if (response.ok) {
            displayResponse('users-response', data);
        } else {
            displayResponse('users-response', data, true);
        }
    } catch (error) {
        displayResponse('users-response', { error: 'Failed to fetch users', message: error.message }, true);
    } finally {
        resetLoading();
    }
}

async function createUser() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const age = parseInt(document.getElementById('userAge').value);
    
    if (!name || !email || !age) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, age })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResponse('users-response', { success: true, user: data });
            document.getElementById('userForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('createUserModal')).hide();
        } else {
            displayResponse('users-response', data, true);
        }
    } catch (error) {
        displayResponse('users-response', { error: 'Failed to create user', message: error.message }, true);
    }
}

// Order Management Functions
async function getAllOrders() {
    const button = event.target;
    const resetLoading = showLoading(button);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`);
        const data = await response.json();
        
        if (response.ok) {
            displayResponse('orders-response', data);
        } else {
            displayResponse('orders-response', data, true);
        }
    } catch (error) {
        displayResponse('orders-response', { error: 'Failed to fetch orders', message: error.message }, true);
    } finally {
        resetLoading();
    }
}

async function createOrder() {
    const userId = parseInt(document.getElementById('orderUserId').value);
    const product = document.getElementById('orderProduct').value;
    const quantity = parseInt(document.getElementById('orderQuantity').value);
    const price = parseFloat(document.getElementById('orderPrice').value);
    
    if (!userId || !product || !quantity || !price) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, product, quantity, price })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResponse('orders-response', { success: true, order: data });
            document.getElementById('orderForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('createOrderModal')).hide();
        } else {
            displayResponse('orders-response', data, true);
        }
    } catch (error) {
        displayResponse('orders-response', { error: 'Failed to create order', message: error.message }, true);
    }
}

// Custom API Testing
async function executeCustomAPI() {
    const method = document.getElementById('api-method').value;
    const endpoint = document.getElementById('api-endpoint').value;
    const body = document.getElementById('api-body').value;
    
    if (!endpoint) {
        alert('Please enter an endpoint');
        return;
    }
    
    const button = event.target;
    const resetLoading = showLoading(button);
    
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (body && (method === 'POST' || method === 'PUT')) {
            try {
                JSON.parse(body); // Validate JSON
                options.body = body;
            } catch (e) {
                alert('Invalid JSON in request body');
                resetLoading();
                return;
            }
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json();
        
        const responseData = {
            status: response.status,
            statusText: response.statusText,
            data: data
        };
        
        displayResponse('custom-response', responseData, !response.ok);
    } catch (error) {
        displayResponse('custom-response', { 
            error: 'Request failed', 
            message: error.message 
        }, true);
    } finally {
        resetLoading();
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check initial health status
    checkAllHealth();
    
    // Set up periodic health checks every 30 seconds
    setInterval(checkAllHealth, 30000);
    
    // Add some sample data to the API testing form
    document.getElementById('api-body').value = JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        age: 25
    }, null, 2);
});

// Utility function to format timestamps
function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
}

// Add event listener for Enter key in custom API testing
document.getElementById('api-endpoint').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        executeCustomAPI();
    }
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + R for refresh health status
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        checkAllHealth();
    }
});

// Service-specific quick actions
function quickTestUsers() {
    document.getElementById('api-method').value = 'GET';
    document.getElementById('api-endpoint').value = '/api/users';
    document.getElementById('api-body').value = '';
}

function quickTestOrders() {
    document.getElementById('api-method').value = 'GET';
    document.getElementById('api-endpoint').value = '/api/orders';
    document.getElementById('api-body').value = '';
}

function quickTestHealth() {
    document.getElementById('api-method').value = 'GET';
    document.getElementById('api-endpoint').value = '/health';
    document.getElementById('api-body').value = '';
}
