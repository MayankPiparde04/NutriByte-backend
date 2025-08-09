# NutriByte Backend

Backend API for NutriByte nutrition tracking application, powered by Google Gemini AI for intelligent food analysis and recommendations.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with refresh tokens
- 👥 **User Management** - User profiles with nutritional data
- 💬 **Chat System** - AI-powered nutrition conversations
- 🤖 **Gemini AI Integration** - Food image analysis and text generation
- 📊 **Nutrition Tracking** - Track meals and nutritional intake
- 🔒 **Security** - Input validation, rate limiting, and secure practices

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Google Gemini AI** - AI-powered food analysis
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB instance
- Google Gemini API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NutriByte-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_ORIGIN=http://localhost:3000
   MONGO_URI=mongodb://localhost:27017/nutribyte
   MONGO_DBNAME=nutribyte
   JWT_SECRET=your-super-secret-jwt-key
   REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
   ACCESS_TOKEN_TTL=15m
   REFRESH_TOKEN_TTL=30d
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/:id` - Get user profile (protected)
- `PUT /api/users/:id` - Update user profile (protected)

### Chats
- `GET /api/chats/recent` - Get recent chats (protected)
- `POST /api/chats` - Create new chat (protected)
- `POST /api/chats/message` - Add message to chat (protected)
- `GET /api/chats/:id/messages` - Get chat messages (protected)
- `DELETE /api/chats/:id` - Delete chat (protected)

### Gemini AI
- `POST /api/gemini/text` - Generate text response (protected)
- `POST /api/gemini/analyze-image` - Analyze food image (protected)

### Health Check
- `GET /api/health` - Health check endpoint

## Project Structure

```
├── controllers/          # Route controllers
│   ├── auth.controller.js
│   ├── chat.controller.js
│   ├── user.controller.js
│   ├── db/
│   │   └── db.js         # Database connection
│   └── gemini/
│       └── index.js      # Gemini AI integration
├── middleware/           # Custom middleware
│   ├── auth.middleware.js
│   └── logger.middleware.js
├── models/              # Mongoose models
│   ├── user.models.js
│   ├── chat.models.js
│   └── nutrition.models.js
├── routes/              # Route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── chat.routes.js
│   └── gemini.routes.js
├── server.js            # Application entry point
├── package.json
└── .env.example         # Environment variables template
```

## Security Features

- Password hashing with bcrypt
- JWT access tokens (short-lived)
- Refresh tokens (long-lived, stored securely)
- Input validation and sanitization
- Rate limiting protection
- CORS configuration
- Secure cookie settings
- Environment variable validation

## Development

```bash
# Start development server with auto-reload
pnpm dev

# Start production server
pnpm start

# Run with specific environment
NODE_ENV=production pnpm start
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `FRONTEND_ORIGIN` | Frontend URL for CORS | No | http://localhost:3000 |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `MONGO_DBNAME` | MongoDB database name | No | nutribyte |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | Yes | - |
| `ACCESS_TOKEN_TTL` | Access token TTL | No | 15m |
| `REFRESH_TOKEN_TTL` | Refresh token TTL | No | 30d |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License
