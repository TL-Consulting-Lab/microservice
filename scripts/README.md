# Development Scripts

This folder contains PowerShell scripts for automating development tasks and testing workflows.

## 📁 Scripts Overview

### 🚀 [start-dev.ps1](./start-dev.ps1)
**Purpose:** Automated development environment startup script

**Features:**
- Checks and kills existing Node.js processes on ports 3000-3002
- Starts all three microservices in separate PowerShell windows
- Provides colored console output for status updates
- Handles dependency installation if needed
- Opens frontend dashboard automatically

**Usage:**
```powershell
# From project root
.\scripts\start-dev.ps1

# Or using npm script
npm run start:dev
```

### 🧪 [test-apis.ps1](./test-apis.ps1)
**Purpose:** Comprehensive API testing and validation script

**Features:**
- Tests all service health endpoints
- Validates CRUD operations for users and orders
- Tests error scenarios and validation
- Provides detailed success/failure reporting
- Includes performance timing for requests

**Usage:**
```powershell
# From project root
.\scripts\test-apis.ps1

# Or using npm script
npm run test:apis
```

### 🔍 [verify-isolation.ps1](./verify-isolation.ps1)
**Purpose:** Validates microservices dependency isolation

**Features:**
- Checks that each service has independent node_modules
- Verifies package.json exists for each service
- Counts dependencies for each service
- Validates no shared dependencies between services
- Ensures true microservice isolation

**Usage:**
```powershell
# From project root
.\scripts\verify-isolation.ps1

# Or using npm script
npm run verify:isolation
```

## 🎯 Quick Start

### Run All Scripts Sequence
```powershell
# 1. Verify isolation first
npm run verify:isolation

# 2. Start development environment
npm run start:dev

# 3. Test all APIs (in another terminal)
npm run test:apis
```

### Individual Script Execution
```powershell
# Direct execution (from project root)
powershell -ExecutionPolicy Bypass -File .\scripts\start-dev.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\test-apis.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\verify-isolation.ps1
```

## 📋 Script Requirements

### Prerequisites
- PowerShell 5.1 or higher
- Node.js and npm installed
- All microservice dependencies installed (`npm run install:all`)

### Execution Policy
If you encounter execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🔧 Customization

### Environment Variables
Scripts can be customized by modifying these variables at the top of each file:
- **Ports:** API Gateway (3000), User Service (3001), Order Service (3002)
- **Frontend Port:** 8080
- **Timeout Values:** Request timeouts for API testing

### Adding New Scripts
When adding new automation scripts:
1. Place them in this `scripts/` folder
2. Add corresponding npm script in `package.json`
3. Update this README with documentation
4. Use consistent PowerShell coding style

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
- The `start-dev.ps1` script automatically handles this by killing existing processes

**PowerShell Execution Policy:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

**Node.js Process Won't Stop:**
```powershell
Get-Process -Name node | Stop-Process -Force
```

**API Tests Failing:**
- Ensure all services are running before executing `test-apis.ps1`
- Check that ports 3000-3002 are available
- Verify services are healthy using health check endpoints

### Debug Mode
Run scripts with verbose output:
```powershell
.\scripts\start-dev.ps1 -Verbose
```

## 📊 Script Outputs

### start-dev.ps1
- Service startup confirmation
- Port availability status
- Browser launch confirmation
- Error handling for failed starts

### test-apis.ps1
- API response validation
- Request timing information
- Success/failure counts
- Detailed error messages

### verify-isolation.ps1
- Dependency count per service
- Isolation validation results
- Recommendations for improvements

## 🔄 Integration with CI/CD

These scripts can be integrated into CI/CD pipelines:
- Use `test-apis.ps1` for integration testing
- Use `verify-isolation.ps1` for architecture validation
- Adapt `start-dev.ps1` for automated deployment testing

---

**Note:** All scripts are designed to work from the project root directory and maintain the microservices architecture principles.
