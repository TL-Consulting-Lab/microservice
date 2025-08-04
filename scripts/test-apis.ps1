# PowerShell script to test all microservices endpoints

Write-Host "🧪 Testing Microservices APIs..." -ForegroundColor Green

# Function to test an endpoint
function Test-Endpoint {
    param($Name, $Url, $Method = "GET", $Body = $null)
    
    Write-Host ""
    Write-Host "Testing $Name..." -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -TimeoutSec 10
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -ContentType "application/json" -TimeoutSec 10
        }
        
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor White
    }
    catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Wait for services to be ready
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test health endpoints
Test-Endpoint "API Gateway Health" "http://localhost:3000/health"
Test-Endpoint "User Service Health" "http://localhost:3001/health"  
Test-Endpoint "Order Service Health" "http://localhost:3002/health"

# Test API Gateway routes
Test-Endpoint "Get All Users (via Gateway)" "http://localhost:3000/api/users"
Test-Endpoint "Get All Orders (via Gateway)" "http://localhost:3000/api/orders"
Test-Endpoint "Get User by ID (via Gateway)" "http://localhost:3000/api/users/1"
Test-Endpoint "Get Order by ID (via Gateway)" "http://localhost:3000/api/orders/1"
Test-Endpoint "Get Orders by User (via Gateway)" "http://localhost:3000/api/orders/user/1"

# Test creating a new user
$newUser = @{
    name = "Test User $(Get-Date -Format 'HHmmss')"
    email = "test$(Get-Date -Format 'HHmmss')@example.com"
    age = 25
} | ConvertTo-Json

Test-Endpoint "Create New User" "http://localhost:3000/api/users" "POST" $newUser

# Test creating a new order
$newOrder = @{
    userId = 1
    product = "Test Product $(Get-Date -Format 'HHmmss')"
    quantity = 1
    price = 99.99
} | ConvertTo-Json

Test-Endpoint "Create New Order" "http://localhost:3000/api/orders" "POST" $newOrder

# Test error scenarios
Test-Endpoint "Get Non-existent User" "http://localhost:3000/api/users/999"
Test-Endpoint "Get Non-existent Order" "http://localhost:3000/api/orders/999"

Write-Host ""
Write-Host "🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "Check the results above for any failures." -ForegroundColor Cyan
