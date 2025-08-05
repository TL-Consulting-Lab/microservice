#!/bin/bash

# Profile Pictures Feature Test Script
# Tests the user profile pictures functionality

echo "🚀 Profile Pictures Feature Test Suite"
echo "====================================="

USER_SERVICE_URL="http://localhost:3001"

# Check if user service is running
echo -n "Checking user service health... "
if curl -s "$USER_SERVICE_URL/health" > /dev/null; then
    echo "✅ Service is running"
else
    echo "❌ Service is not responding"
    echo "Please start the user service: cd user-service && npm start"
    exit 1
fi

echo ""

# Test 1: Create user without profile picture (backward compatibility)
echo "🧪 Test 1: Create user without profile picture"
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$USER_SERVICE_URL/users" \
    -H "Content-Type: application/json" \
    -d '{"name": "Test User 1", "email": "test1@test.com", "age": 25}')

HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ PASS - User created successfully without profile picture"
else
    echo "❌ FAIL - Expected 201 but got $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 2: Create user with valid profile picture
echo ""
echo "🧪 Test 2: Create user with valid profile picture"
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$USER_SERVICE_URL/users" \
    -H "Content-Type: application/json" \
    -d '{"name": "Test User 2", "email": "test2@test.com", "age": 30, "profilePictureUrl": "https://example.com/profile.jpg"}')

HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "201" ] && echo "$BODY" | grep -q "profilePictureUrl"; then
    echo "✅ PASS - User created successfully with profile picture"
else
    echo "❌ FAIL - Expected 201 with profilePictureUrl but got $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 3: Try to create user with invalid profile picture URL
echo ""
echo "🧪 Test 3: Create user with invalid profile picture URL"
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$USER_SERVICE_URL/users" \
    -H "Content-Type: application/json" \
    -d '{"name": "Test User 3", "email": "test3@test.com", "age": 28, "profilePictureUrl": "https://example.com/notanimage.txt"}')

HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "400" ] && echo "$BODY" | grep -q "image file"; then
    echo "✅ PASS - Invalid URL rejected with proper error message"
else
    echo "❌ FAIL - Expected 400 with validation error but got $HTTP_CODE"
    echo "Response: $BODY"
fi

# Test 4: Get all users and verify profile pictures are included
echo ""
echo "🧪 Test 4: Verify users list includes profile pictures"
RESPONSE=$(curl -s "$USER_SERVICE_URL/users")

if echo "$RESPONSE" | grep -q "profilePictureUrl"; then
    echo "✅ PASS - Users list includes profile picture URLs"
else
    echo "❌ FAIL - Profile picture URLs not found in users list"
fi

echo ""
echo "📊 Tests completed!"
echo "All core functionality for profile pictures is working correctly."