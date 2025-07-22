# 🚀 Quick Start Guide

Get the YSSVT Community Platform up and running in minutes!

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

## Option 1: Automated Installation (Recommended)

Run the installation script:

```bash
./install.sh
```

This will:
- ✅ Check prerequisites
- ✅ Install all dependencies
- ✅ Create environment files
- ✅ Setup PWA icons directory

## Option 2: Manual Installation

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your MongoDB connection
# MONGODB_URI=mongodb://localhost:27017/yssvt_community
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

## 🏃‍♂️ Running the Application

### 1. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env
```

### 2. Start Backend

```bash
cd backend
npm run dev
```

Backend will be available at: http://localhost:5000

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:3000

## 🧪 Testing the Setup

### 1. Check Backend Health

Visit: http://localhost:5000/health

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Frontend

- Open http://localhost:3000
- You should see the YSSVT Community homepage
- Try the "Join Community" button to test registration

### 3. Test API Endpoints

```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🔧 Environment Configuration

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/yssvt_community

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📱 PWA Features

### Install the App

1. Open http://localhost:3000 in Chrome
2. Click the install icon in the address bar
3. Or use the browser menu: More tools > Create shortcut

### Offline Testing

1. Install the PWA
2. Disconnect from the internet
3. The app should still work for cached content

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB server with `mongod`

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change PORT in backend/.env or kill the process using the port

#### 3. Frontend Build Error
```
Module not found: Can't resolve 'react'
```
**Solution**: Run `npm install` in the frontend directory

#### 4. CORS Error
```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Check CORS_ORIGIN in backend/.env matches your frontend URL

### Debug Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB status
mongosh --eval "db.runCommand('ping')"

# Check if ports are in use
lsof -i :3000
lsof -i :5000

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📊 Next Steps

After successful setup:

1. **Create Admin User**: Register and manually update role to 'admin' in database
2. **Add Real Icons**: Replace placeholder PWA icons in `frontend/public/icons/`
3. **Configure Email**: Set up email service for notifications
4. **Add Payment Gateway**: Integrate Stripe/PayPal for donations
5. **Deploy**: Deploy to production servers

## 🆘 Need Help?

- 📖 Read the full [README.md](README.md)
- 🐛 Check [Troubleshooting](#troubleshooting) section
- 💬 Create an issue in the repository
- 📧 Contact: info@yssvt.org

---

**Happy coding! 🎉** 