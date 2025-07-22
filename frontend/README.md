# YSSVT Community Frontend

A Next.js Progressive Web App (PWA) for the YSSVT Community platform.

## Features

- **Progressive Web App**: Installable, offline-capable, and responsive
- **Authentication**: Login, registration, and profile management
- **Event Management**: View, create, and manage community events
- **Donation System**: Secure donation processing and tracking
- **Role-based Access**: Admin, Manager, and Member roles
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching
- **State Management**: Zustand for global state management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query + Axios
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **PWA**: next-pwa

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   **Option A: Automated Setup**
   ```bash
   ./setup-env.sh
   ```
   
   **Option B: Manual Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## PWA Features

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

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with PWA meta tags
│   ├── page.tsx        # Home page
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── dashboard/      # User dashboard
│   ├── events/         # Events pages
│   └── donations/      # Donations pages
├── lib/               # Utility functions and API client
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
└── globals.css        # Global styles and Tailwind config
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## PWA Configuration

### Manifest
- App name, description, and icons
- Theme colors and display mode
- Orientation and scope settings

### Service Worker
- Caching strategies for offline support
- Background sync for data updates
- Push notification handling

### Icons
- Multiple sizes for different devices
- Maskable icons for adaptive UI
- Apple touch icons for iOS

## User Roles

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

## API Integration

The frontend communicates with the backend API through:
- RESTful endpoints for CRUD operations
- JWT authentication
- Real-time updates with React Query
- Error handling and retry logic

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Optional dark theme support
- **Animations**: Smooth transitions and micro-interactions

## Performance

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Service worker and browser caching
- **Bundle Analysis**: Webpack bundle analyzer
- **Lighthouse**: Performance monitoring

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
- Netlify
- AWS Amplify
- Docker containers
- Static hosting

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:5000/api |

**Note**: Only `NEXT_PUBLIC_API_URL` is required. The app name and description are hardcoded for simplicity.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 