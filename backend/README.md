# YSSVT Community Backend

A Node.js + Express + MongoDB backend for the YSSVT Community PWA.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Registration, login, profile management
- **Event Management**: CRUD operations for community events
- **Donation System**: Handle community donations with payment tracking
- **Role-based Access**: Admin, Manager, and Member roles
- **Security**: Rate limiting, CORS, input validation, password hashing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting
- **Language**: TypeScript

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/yssvt_community
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Manager/Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile

### Events
- `GET /api/events` - Get all events (public)
- `GET /api/events/:id` - Get event by ID (public)
- `POST /api/events` - Create new event (Manager/Admin only)
- `PUT /api/events/:id` - Update event (Manager/Admin only)
- `DELETE /api/events/:id` - Delete event (Manager/Admin only)

### Donations
- `GET /api/donations` - Get all donations (Manager/Admin only)
- `GET /api/donations/my` - Get user's donations
- `POST /api/donations` - Create new donation
- `PUT /api/donations/:id/status` - Update donation status (Manager/Admin only)

## User Roles

- **Member**: Basic access, can view events and make donations
- **Manager**: Can manage events and view donations
- **Admin**: Full access to all features

## Database Models

### User
- firstName, lastName, email, password
- role (member/manager/admin)
- phone, address, profileImage
- isActive, emailVerified
- timestamps

### Event
- title, description, date, location
- organizer (ref to User)
- maxParticipants, currentParticipants
- image, isActive
- timestamps

### Donation
- donor (ref to User)
- amount, currency, purpose
- anonymous, paymentMethod
- status (pending/completed/failed)
- transactionId
- timestamps

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Role-based access control

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/yssvt_community |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | JWT expiration time | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 (15 min) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 | 