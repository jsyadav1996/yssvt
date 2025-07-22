#!/bin/bash

# YSSVT Community Platform Installation Script
echo "🚀 Installing YSSVT Community Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    cd backend
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in backend directory"
        exit 1
    fi
    
    npm install
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file for backend..."
        cp env.example .env
        print_warning "Please edit backend/.env with your configuration"
    fi
    
    cd ..
}

# Install frontend dependencies
install_frontend() {
    print_status "Installing frontend dependencies..."
    cd frontend
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in frontend directory"
        exit 1
    fi
    
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    # Create .env.local file if it doesn't exist
    if [ ! -f ".env.local" ]; then
        print_status "Creating .env.local file for frontend..."
        echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
        print_success "Frontend environment file created"
    fi
    
    cd ..
}

# Create PWA icons directory
create_pwa_icons() {
    print_status "Creating PWA icons directory..."
    mkdir -p frontend/public/icons
    
    # Create placeholder icon files
    for size in 16 32 72 96 128 144 152 192 384 512; do
        touch "frontend/public/icons/icon-${size}x${size}.png"
    done
    
    print_success "PWA icons directory created (placeholder files)"
    print_warning "Please replace placeholder icons with actual app icons"
}

# Main installation process
main() {
    echo "=========================================="
    echo "YSSVT Community Platform Installation"
    echo "=========================================="
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_node
    check_npm
    
    # Install dependencies
    install_backend
    install_frontend
    
    # Setup PWA
    create_pwa_icons
    
    echo ""
    echo "=========================================="
    print_success "Installation completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Configure MongoDB connection in backend/.env"
    echo "2. Start MongoDB server: mongod"
    echo "3. Start backend: cd backend && npm run dev"
    echo "4. Start frontend: cd frontend && npm run dev"
    echo "5. Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:5000"
    echo ""
    echo "For detailed setup instructions, see README.md"
    echo ""
}

# Run main function
main 