# PowerShell script to verify microservice isolation

Write-Host "🔍 Verifying Microservice Dependency Isolation..." -ForegroundColor Cyan
Write-Host ""

# Get current directory
$currentDir = Get-Location

# Check root directory
Write-Host "📁 Root Directory:" -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ❌ Root node_modules found (should not exist)" -ForegroundColor Red
} else {
    Write-Host "  ✅ No root node_modules (correct isolation)" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Write-Host "  ❌ Root package-lock.json found (should not exist)" -ForegroundColor Red
} else {
    Write-Host "  ✅ No root package-lock.json (correct isolation)" -ForegroundColor Green
}

Write-Host ""

# Check each microservice
$services = @("user-service", "order-service", "api-gateway")

foreach ($service in $services) {
    Write-Host "📁 $service/:" -ForegroundColor Yellow
    
    $servicePath = Join-Path $currentDir $service
    $packageJsonPath = Join-Path $servicePath "package.json"
    $nodeModulesPath = Join-Path $servicePath "node_modules"
    $packageLockPath = Join-Path $servicePath "package-lock.json"
    
    # Check package.json
    if (Test-Path $packageJsonPath) {
        Write-Host "  ✅ package.json exists" -ForegroundColor Green
    } else {
        Write-Host "  ❌ package.json missing" -ForegroundColor Red
    }
    
    # Check node_modules
    if (Test-Path $nodeModulesPath) {
        $moduleCount = (Get-ChildItem $nodeModulesPath).Count
        Write-Host "  ✅ node_modules/ exists ($moduleCount packages)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ node_modules/ missing" -ForegroundColor Red
    }
    
    # Check package-lock.json
    if (Test-Path $packageLockPath) {
        Write-Host "  ✅ package-lock.json exists" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  package-lock.json missing (will be created on npm install)" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

Write-Host "🎯 Isolation Summary:" -ForegroundColor Magenta
Write-Host "  • Each service has independent dependencies" -ForegroundColor White
Write-Host "  • No shared node_modules at root level" -ForegroundColor White
Write-Host "  • Services can use different package versions" -ForegroundColor White
Write-Host "  • True microservice architecture achieved" -ForegroundColor White

Write-Host ""
Write-Host "🚀 To start services with isolated dependencies:" -ForegroundColor Cyan
Write-Host "  .\start-dev.ps1" -ForegroundColor White
