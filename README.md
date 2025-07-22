# YSSVT Community Platform

A comprehensive Progressive Web App (PWA) for community management with authentication, events, donations, and role-based access control.

## 🚀 Features

### Core Features
- **User Authentication & Registration**: Secure JWT-based authentication
- **Role-based Access Control**: Admin, Manager, and Member roles
- **Event Management**: Create, view, and manage community events
- **Donation System**: Secure donation processing and tracking
- **Progressive Web App**: Installable, offline-capable mobile app

### Technical Features
- **Backend**: Node.js + Express + MongoDB + TypeScript
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **PWA**: Service worker, manifest, offline support
- **Security**: JWT tokens, password hashing, rate limiting
- **Real-time**: Efficient data fetching with React Query

## 🏗️ Project Structure

```
yssvt/
├── backend/           # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── models/    # Mongoose models
│   │   ├── routes/    # API routes
│   │   ├── middleware/# Custom middleware
│   │   ├── types/     # TypeScript types
│   │   └── index.ts   # Server entry point
│   ├── package.json
│   └── README.md
├── frontend/          # Next.js PWA
│   ├── src/
│   │   ├── app/       # Next.js App Router
│   │   ├── components/# React components
│   │   ├── lib/       # Utilities and API client
│   │   ├── store/     # Zustand state management
│   │   └── types/     # TypeScript types
│   ├── public/        # Static assets and PWA files
│   ├── package.json
│   └── README.md
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript
- **Security**: bcryptjs, helmet, cors, rate-limiting

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query + Axios
- **PWA**: next-pwa with service worker

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd yssvt
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Environment setup
cp env.example .env
# Edit .env with your configuration

# Start MongoDB (if using local)
mongod

# Run in development mode
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Environment setup
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Run development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🔐 User Roles & Permissions

### Member
- View events and community updates
- Make donations
- Update profile information
- Access basic community features

### Manager
- All member permissions
- Create and manage events
- View donation reports
- Moderate community content

### Admin
- All manager permissions
- User management
- System configuration
- Full platform access

## 📱 PWA Features

### Installation
- Users can install the app on their devices
- Works offline with service worker caching
- Native app-like experience

### Offline Support
- Service worker caches essential resources
- Offline-first approach for better performance
- Background sync for data updates

### Push Notifications
- Real-time notifications for events and updates
- Customizable notification settings
- Cross-platform support

## 🔧 API Endpoints

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

## 🗄️ Database Models

### User
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'member' | 'manager' | 'admin';
  phone?: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Event
```typescript
{
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: User;
  maxParticipants?: number;
  currentParticipants: number;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Donation
```typescript
{
  donor: User;
  amount: number;
  currency: string;
  purpose?: string;
  anonymous: boolean;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent abuse and DDoS
- **Input Validation**: Express-validator for data sanitization
- **CORS Protection**: Configured for frontend domain
- **Helmet Security**: HTTP headers protection
- **Role-based Access**: Granular permission control

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm start
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## 🧪 Development

### Backend Development
```bash
cd backend
npm run dev  # Development with auto-reload
npm run build  # Build for production
npm test  # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev  # Development server
npm run build  # Build for production
npm run lint  # Run ESLint
npm run type-check  # TypeScript type checking
```

## 📊 Performance

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Service worker and browser caching
- **Bundle Analysis**: Webpack bundle analyzer
- **Lighthouse**: Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: info@yssvt.org
- Documentation: [Wiki](link-to-wiki)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for the database
- All contributors and community members 