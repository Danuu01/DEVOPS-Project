#!/bin/bash

echo "🎯 Setting up Goal Tracker Application..."
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    cd ..
    exit 1
fi

cd ..

# Check if Angular CLI is installed globally
if ! command -v ng &> /dev/null; then
    echo "📦 Installing Angular CLI globally..."
    npm install -g @angular/cli
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Angular CLI"
        exit 1
    fi
fi

echo "✅ Angular CLI installed"

# Create data directory
echo "📁 Creating data directory..."
mkdir -p data

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker detected - you can use Docker deployment"
    echo "   Run: docker-compose up --build"
else
    echo "ℹ️  Docker not detected - you can still run locally"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start the application:"
echo "   1. Backend: npm run dev"
echo "   2. Frontend: cd frontend && npm start"
echo "   3. Open: http://localhost:4200"
echo ""
echo "🐳 Or use Docker: docker-compose up --build"
echo ""
echo "📚 See README.md for more information"
