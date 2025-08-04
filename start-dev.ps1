# PowerShell script to start all services for development

Write-Host "🚀 Starting Microservices Development Environment..." -ForegroundColor Green

# Function to start a service in a new PowerShell window
function Start-Service {
    param($ServiceName, $Path, $Command)
    
    Write-Host "Starting $ServiceName..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; $Command"
}

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Get current directory
$currentDir = Get-Location

# Services to check and install dependencies for
$services = @("user-service", "order-service", "api-gateway")

Write-Host "🔍 Checking dependencies for each microservice..." -ForegroundColor Cyan

foreach ($service in $services) {
    $servicePath = Join-Path $currentDir $service
    $nodeModulesPath = Join-Path $servicePath "node_modules"
    $packageJsonPath = Join-Path $servicePath "package.json"
    
    Write-Host "  Checking $service..." -ForegroundColor Gray
    
    if (!(Test-Path $packageJsonPath)) {
        Write-Host "    ❌ package.json not found in $service" -ForegroundColor Red
        exit 1
    }
    
    if (!(Test-Path $nodeModulesPath)) {
        Write-Host "    📦 Installing dependencies for $service..." -ForegroundColor Yellow
        Set-Location $servicePath
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "    ❌ Failed to install dependencies for $service" -ForegroundColor Red
            Set-Location $currentDir
            exit 1
        }
        Write-Host "    ✅ Dependencies installed for $service" -ForegroundColor Green
        Set-Location $currentDir
    } else {
        Write-Host "    ✅ Dependencies already installed for $service" -ForegroundColor Green
    }
}

Write-Host "✅ All dependencies verified. Starting services..." -ForegroundColor Green
Write-Host ""

# Start each service in its own terminal with isolated dependencies
Start-Service "User Service" (Join-Path $currentDir "user-service") "npm start"
Start-Sleep -Seconds 3

Start-Service "Order Service" (Join-Path $currentDir "order-service") "npm start"
Start-Sleep -Seconds 3

Start-Service "API Gateway" (Join-Path $currentDir "api-gateway") "npm start"

Write-Host "🎉 All microservices started with isolated dependencies!" -ForegroundColor Green
Write-Host ""
Write-Host "Each service runs with its own node_modules:" -ForegroundColor Cyan
Write-Host "  • User Service:  http://localhost:3001 (./user-service/node_modules)" -ForegroundColor White
Write-Host "  • Order Service: http://localhost:3002 (./order-service/node_modules)" -ForegroundColor White  
Write-Host "  • API Gateway:   http://localhost:3000 (./api-gateway/node_modules)" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Service Independence:" -ForegroundColor Magenta
Write-Host "  • Each service has its own package.json and dependencies" -ForegroundColor White
Write-Host "  • No shared node_modules directory" -ForegroundColor White
Write-Host "  • Services can use different versions of the same packages" -ForegroundColor White
Write-Host "  • True microservice isolation achieved" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each service window to stop the services." -ForegroundColor Yellow
Write-Host "To test the APIs, see API_EXAMPLES.md file." -ForegroundColor Cyan
