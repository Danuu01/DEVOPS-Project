#!/bin/bash

echo "🚀 Starting Goal Tracker Application..."
echo "======================================"

# Check if the application is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Stopping existing process..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

if lsof -Pi :4200 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 4200 is already in use. Stopping existing process..."
    lsof -ti:4200 | xargs kill -9
    sleep 2
fi

# Start backend server
echo "🔧 Starting backend server on port 3000..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if ! curl -s http://localhost:3000/api/goals > /dev/null; then
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend started successfully"

# Start frontend
echo "🎨 Starting frontend on port 4200..."
cd frontend
npm start &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 Goal Tracker is starting up!"
echo ""
echo "📱 Frontend: http://localhost:4200"
echo "🔧 Backend API: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
