# NutriByte Backend API Documentation

**Base URL:** `http://localhost:5000/api`  
**Version:** 1.0.0  
**Authentication:** JWT Bearer Token (except where noted)

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com", 
  "password": "mypassword123",
  "phone": "1234567890"
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68973d6a6c938cc7ea00f926",
    "fullname": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "createdAt": "2025-08-09T12:22:02.414Z",
    "updatedAt": "2025-08-09T12:22:02.414Z"
  }
}
```

**Validation:**
- All fields are required
- Email must be valid format
- Password minimum 6 characters
- Phone minimum 10 digits
- Email and phone must be unique

---

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68973d6a6c938cc7ea00f926",
    "fullname": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

---

### Refresh Token
```http
POST /api/auth/refresh
```

**Headers:** None (uses HTTP-only cookies)

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Logout User
```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "message": "Logged out"
}
```

---

## 👥 User Management Endpoints

### Get User Profile
```http
GET /api/users/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "_id": "68973d6a6c938cc7ea00f926",
  "id": "68973d6a6c938cc7ea00f926",
  "fullname": "John Doe",
  "phone": "1234567890",
  "email": "john@example.com",
  "age": 25,
  "height": 175,
  "weight": 70,
  "createdAt": "2025-08-09T12:22:02.414Z",
  "updatedAt": "2025-08-09T12:22:03.353Z"
}
```

**Note:** Users can only access their own profile data.

---

### Update User Profile
```http
PUT /api/users/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body (all optional):**
```json
{
  "fullname": "John Smith",
  "phone": "9876543210",
  "age": 26,
  "height": 180,
  "weight": 75
}
```

**Response (200):**
```json
{
  "_id": "68973d6a6c938cc7ea00f926",
  "id": "68973d6a6c938cc7ea00f926",
  "fullname": "John Smith",
  "phone": "9876543210",
  "email": "john@example.com",
  "age": 26,
  "height": 180,
  "weight": 75,
  "createdAt": "2025-08-09T12:22:02.414Z",
  "updatedAt": "2025-08-09T12:25:15.123Z"
}
```

**Validation:**
- Age: 1-120 years
- Height: 1-300 cm
- Weight: 1-1000 kg
- Cannot update: password, email, refreshTokens

---

## 💬 Chat System Endpoints

### Get Recent Chats
```http
GET /api/chats/recent
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
[
  {
    "chatId": "68973d6b6c938cc7ea00f93d",
    "roomId": "room-test-1754742123535",
    "title": "My First Nutrition Chat",
    "firstMessage": {
      "senderId": "68973d6a6c938cc7ea00f926",
      "text": "Hello, I want to know about healthy breakfast options.",
      "fromAI": false,
      "_id": "68973d6b6c938cc7ea00f943",
      "timestamp": "2025-08-09T12:22:03.785Z"
    },
    "firstMessageTime": "2025-08-09T12:22:03.785Z",
    "lastUpdated": "2025-08-09T12:22:07.165Z"
  }
]
```

---

### Create New Chat
```http
POST /api/chats
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "My Nutrition Chat",
  "roomId": "room-custom-123" // optional
}
```

**Response (201):**
```json
{
  "roomId": "room-custom-123",
  "userId": "68973d6a6c938cc7ea00f926",
  "title": "My Nutrition Chat",
  "messages": [],
  "isTemplate": false,
  "_id": "68973d6b6c938cc7ea00f93d",
  "lastUpdated": "2025-08-09T12:22:03.595Z",
  "createdAt": "2025-08-09T12:22:03.595Z",
  "updatedAt": "2025-08-09T12:22:03.595Z"
}
```

---

### Add Message to Chat
```http
POST /api/chats/message
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body (Text Message):**
```json
{
  "chatId": "68973d6b6c938cc7ea00f93d", // optional, creates new chat if not provided
  "senderId": "68973d6a6c938cc7ea00f926",
  "text": "What are healthy breakfast options?",
  "fromAI": false
}
```

**Request Body (Image Message):**
```json
{
  "chatId": "68973d6b6c938cc7ea00f93d",
  "senderId": "68973d6a6c938cc7ea00f926", 
  "imageUri": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "fromAI": false
}
```

**Request Body (AI Message):**
```json
{
  "chatId": "68973d6b6c938cc7ea00f93d",
  "senderId": null,
  "text": "Here are some healthy breakfast options...",
  "fromAI": true
}
```

**Response (200):**
```json
{
  "_id": "68973d6b6c938cc7ea00f93d",
  "roomId": "room-custom-123",
  "userId": "68973d6a6c938cc7ea00f926",
  "title": "My Nutrition Chat",
  "messages": [
    {
      "senderId": "68973d6a6c938cc7ea00f926",
      "text": "What are healthy breakfast options?",
      "fromAI": false,
      "_id": "68973d6b6c938cc7ea00f943",
      "timestamp": "2025-08-09T12:22:03.785Z"
    }
  ],
  "lastUpdated": "2025-08-09T12:22:03.786Z"
}
```

---

### Get Chat Messages
```http
GET /api/chats/:id/messages
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "chatId": "68973d6b6c938cc7ea00f93d",
  "roomId": "room-custom-123",
  "title": "My Nutrition Chat",
  "messages": [
    {
      "senderId": "68973d6a6c938cc7ea00f926",
      "text": "Hello, I want to know about healthy breakfast options.",
      "fromAI": false,
      "_id": "68973d6b6c938cc7ea00f943",
      "timestamp": "2025-08-09T12:22:03.785Z"
    },
    {
      "senderId": null,
      "text": "Here are some healthy breakfast options: 1. Oatmeal with berries...",
      "fromAI": true,
      "_id": "68973d6f6c938cc7ea00f951",
      "timestamp": "2025-08-09T12:22:07.165Z"
    }
  ]
}
```

---

### Delete Chat
```http
DELETE /api/chats/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (204):** No content

---

## 🤖 Gemini AI Endpoints

### Generate Text Response
```http
POST /api/gemini/text
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "prompt": "Give me 3 healthy breakfast ideas with approximate calorie counts."
}
```

**Response (200):**
```json
{
  "text": "1. **Overnight Oats (approx. 350 calories):** ½ cup rolled oats, 1 cup milk (dairy or non-dairy), ½ cup berries, 1 tbsp chia seeds.\n\n2. **Greek Yogurt with Fruit & Nuts (approx. 250 calories):** 1 cup Greek yogurt, ½ cup fruit (berries, banana), ¼ cup nuts (almonds, walnuts).\n\n3. **Scrambled Eggs with Veggies (approx. 200 calories):** 2 eggs scrambled with ½ cup chopped vegetables (spinach, peppers)."
}
```

**Validation:**
- Prompt is required
- Max 10,000 characters
- Must be non-empty string

---

### Analyze Food Image
```http
POST /api/gemini/analyze-image
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." // Base64 image data
}
```

**Alternative Request Body:**
```json
{
  "image": "https://example.com/food-image.jpg" // HTTP URL
}
```

**Response (200):**
```json
{
  "text": "I can see a bowl of oatmeal topped with fresh blueberries and sliced almonds. Here's the nutritional analysis:\n\n**Estimated Nutritional Information:**\n- Calories: ~350-400\n- Protein: ~12-15g\n- Carbohydrates: ~55-65g\n- Fat: ~8-12g\n- Fiber: ~8-10g\n\n**Ingredients Identified:**\n- Rolled oats (1/2 cup)\n- Fresh blueberries (1/3 cup)\n- Sliced almonds (2 tbsp)\n- Milk (estimated 1/2 cup)\n\n**Nutritional Benefits:**\n- High in fiber for digestive health\n- Antioxidants from blueberries\n- Healthy fats from almonds\n- Sustained energy from complex carbs"
}
```

**Validation:**
- Image data is required
- Must be data URL or HTTP URL
- Supports common image formats (JPEG, PNG, etc.)

---

## 🏥 System Endpoints

### Health Check
```http
GET /api/health
```

**Headers:** None required (public endpoint)

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-08-09T12:22:02.326Z",
  "version": "1.0.0"
}
```

---

## ⚠️ Error Responses

### Common Error Format
```json
{
  "error": "Error message description"
}
```

### Status Codes
- **200** - Success
- **201** - Created
- **204** - No Content (successful deletion)
- **400** - Bad Request (validation error)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (access denied)
- **404** - Not Found
- **409** - Conflict (duplicate email/phone)
- **500** - Internal Server Error

### Example Error Responses

**Validation Error (400):**
```json
{
  "error": "All fields are required",
  "required": ["fullname", "email", "password", "phone"]
}
```

**Authentication Error (401):**
```json
{
  "error": "Invalid email or password"
}
```

**Access Denied (403):**
```json
{
  "error": "Access denied"
}
```

**Not Found (404):**
```json
{
  "error": "API endpoint not found"
}
```

**Conflict Error (409):**
```json
{
  "error": "User with this email already exists"
}
```

---

## 🔑 Authentication Notes

### JWT Token Usage
All protected endpoints require the JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Lifecycle
- **Access Token:** Expires in 15 minutes
- **Refresh Token:** Expires in 30 days
- **Auto-refresh:** Use `/api/auth/refresh` to get new access token

### Cookies
Refresh tokens are automatically stored in HTTP-only cookies for security.

---

## 🌐 CORS Configuration

The backend accepts requests from:
- `http://localhost:3000` (default)
- Configurable via `FRONTEND_ORIGIN` environment variable

---

## 📱 Mobile App Integration

### Network Configuration
- **iOS Simulator:** `http://localhost:5000/api`
- **Android Emulator:** `http://10.0.2.2:5000/api`  
- **Physical Device:** `http://YOUR_COMPUTER_IP:5000/api`

### Image Upload
For image analysis, convert images to base64 format:
```javascript
const response = await fetch(imageUri);
const blob = await response.blob();
const base64 = await new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.readAsDataURL(blob);
});
```

---

## 🚀 Quick Start Example

```javascript
// 1. Register user
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullname: 'John Doe',
    email: 'john@example.com', 
    password: 'mypassword123',
    phone: '1234567890'
  })
});

const { accessToken, user } = await registerResponse.json();

// 2. Use token for protected requests
const chatResponse = await fetch('http://localhost:5000/api/chats/recent', {
  headers: { 
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});

const recentChats = await chatResponse.json();
```

---

**Last Updated:** August 9, 2025  
**Backend Version:** 1.0.0  
**Total Endpoints:** 12
