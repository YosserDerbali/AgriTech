#!/bin/bash

# Color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}=== AgriTech Backend API Testing ===${NC}\n"

# ============================================================================
# 1. CREATE ADMIN TEST USER
# ============================================================================
echo -e "${YELLOW}1. Creating test admin user...${NC}"
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/create-admin-test" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123"
  }')
echo -e "${GREEN}Response:${NC}"
echo "$ADMIN_RESPONSE" | jq . 2>/dev/null || echo "$ADMIN_RESPONSE"
echo ""

# ============================================================================
# 2. AUTH ENDPOINTS - REGISTER
# ============================================================================
echo -e "${YELLOW}2. Register as Farmer...${NC}"
FARMER_REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Farmer",
    "email": "farmer@test.com",
    "password": "farmer123",
    "role": "FARMER"
  }')
echo -e "${GREEN}Response:${NC}"
echo "$FARMER_REGISTER" | jq . 2>/dev/null || echo "$FARMER_REGISTER"

# Extract token for later use
FARMER_TOKEN=$(echo "$FARMER_REGISTER" | jq -r '.token' 2>/dev/null)
echo -e "${BLUE}Token: $FARMER_TOKEN${NC}\n"

# Register as Agronomist
echo -e "${YELLOW}3. Register as Agronomist...${NC}"
AGRONOMIST_REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Agronomist",
    "email": "agronomist@test.com",
    "password": "agronomist123",
    "role": "AGRONOMIST"
  }')
echo -e "${GREEN}Response:${NC}"
echo "$AGRONOMIST_REGISTER" | jq . 2>/dev/null || echo "$AGRONOMIST_REGISTER"
AGRONOMIST_TOKEN=$(echo "$AGRONOMIST_REGISTER" | jq -r '.token' 2>/dev/null)
echo -e "${BLUE}Token: $AGRONOMIST_TOKEN${NC}\n"

# ============================================================================
# 3. AUTH ENDPOINTS - LOGIN
# ============================================================================
echo -e "${YELLOW}4. Login as Farmer...${NC}"
FARMER_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "farmer123",
    "role": "FARMER"
  }')
echo -e "${GREEN}Response:${NC}"
echo "$FARMER_LOGIN" | jq . 2>/dev/null || echo "$FARMER_LOGIN"
FARMER_TOKEN=$(echo "$FARMER_LOGIN" | jq -r '.token' 2>/dev/null)
echo ""

echo -e "${YELLOW}5. Login as Agronomist...${NC}"
AGRONOMIST_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agronomist@test.com",
    "password": "agronomist123",
    "role": "AGRONOMIST"
  }')
echo -e "${GREEN}Response:${NC}"
echo "$AGRONOMIST_LOGIN" | jq . 2>/dev/null || echo "$AGRONOMIST_LOGIN"
AGRONOMIST_TOKEN=$(echo "$AGRONOMIST_LOGIN" | jq -r '.token' 2>/dev/null)
echo ""

# ============================================================================
# 4. ADMIN LOGIN
# ============================================================================
echo -e "${YELLOW}6. Admin Login...${NC}"
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }')
echo -e "${GREEN}Response:${NC}"
echo "$ADMIN_LOGIN" | jq . 2>/dev/null || echo "$ADMIN_LOGIN"
ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.token' 2>/dev/null)
echo -e "${BLUE}Token: $ADMIN_TOKEN${NC}\n"

# ============================================================================
# 5. ADMIN ENDPOINTS - USERS MANAGEMENT
# ============================================================================
echo -e "${YELLOW}7. Get all users (Admin only)...${NC}"
curl -s -X GET "$BASE_URL/admin/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq . 2>/dev/null || echo "Error"
echo ""

echo -e "${YELLOW}8. Create new user via Admin...${NC}"
NEW_USER=$(curl -s -X POST "$BASE_URL/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "New Test User",
    "email": "newuser@test.com",
    "password": "newuser123",
    "role": "FARMER"
  }')
echo -e "${GREEN}Response:${NC}"
echo "$NEW_USER" | jq . 2>/dev/null || echo "$NEW_USER"
NEW_USER_ID=$(echo "$NEW_USER" | jq -r '.data.id' 2>/dev/null)
echo ""

# ============================================================================
# 6. UPDATE USER OPERATIONS
# ============================================================================
if [ ! -z "$NEW_USER_ID" ] && [ "$NEW_USER_ID" != "null" ]; then
  echo -e "${YELLOW}9. Update user details...${NC}"
  curl -s -X PATCH "$BASE_URL/admin/users/$NEW_USER_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{
      "name": "Updated User Name"
    }' | jq . 2>/dev/null || echo "Error"
  echo ""

  echo -e "${YELLOW}10. Update user role...${NC}"
  curl -s -X PATCH "$BASE_URL/admin/users/$NEW_USER_ID/role" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{
      "role": "AGRONOMIST"
    }' | jq . 2>/dev/null || echo "Error"
  echo ""

  echo -e "${YELLOW}11. Update user status...${NC}"
  curl -s -X PATCH "$BASE_URL/admin/users/$NEW_USER_ID/status" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{
      "isActive": false
    }' | jq . 2>/dev/null || echo "Error"
  echo ""

  echo -e "${YELLOW}12. Delete user...${NC}"
  curl -s -X DELETE "$BASE_URL/admin/users/$NEW_USER_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN" | jq . 2>/dev/null || echo "Error"
  echo ""
fi

# ============================================================================
# 7. ERROR CASES
# ============================================================================
echo -e "${YELLOW}13. Test error cases:${NC}"

echo -e "${BLUE}a) Register with missing fields (should fail)${NC}"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test"
  }' | jq . 2>/dev/null || echo "Error"
echo ""

echo -e "${BLUE}b) Login with invalid credentials (should fail)${NC}"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@test.com",
    "password": "wrongpassword"
  }' | jq . 2>/dev/null || echo "Error"
echo ""

echo -e "${BLUE}c) Access admin endpoint without token (should fail)${NC}"
curl -s -X GET "$BASE_URL/admin/users" | jq . 2>/dev/null || echo "Error"
echo ""

echo -e "${BLUE}d) Access admin endpoint with farmer token (should fail)${NC}"
curl -s -X GET "$BASE_URL/admin/users" \
  -H "Authorization: Bearer $FARMER_TOKEN" | jq . 2>/dev/null || echo "Error"
echo ""

echo -e "${GREEN}=== Testing Complete ===${NC}"
