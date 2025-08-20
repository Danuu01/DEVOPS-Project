# 🎯 Goal Tracker

A modern web application for tracking 30-day challenges and building better habits. Built with Angular frontend, Node.js backend, and SQLite database.

## ✨ Features

- **Create 30-Day Challenges**: Set up new goals with custom titles and descriptions
- **Interactive Calendar**: Visual 30-day calendar showing progress
- **Daily Tracking**: Click on calendar days to mark them as completed
- **Progress Analytics**: View current streak, best streak, and completion rate
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant feedback when marking days as complete
- **Data Persistence**: SQLite database stores all your goals and progress

## 🏗️ Architecture

- **Frontend**: Angular 16 with standalone components
- **Backend**: Node.js with Express.js
- **Database**: SQLite (H2 compatible)
- **Styling**: Modern CSS with responsive design
- **Containerization**: Docker support for easy deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional, for containerized deployment)

### Option 1: Local Development

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start the backend server:**
   ```bash
   npm run dev
   ```

3. **In a new terminal, start the Angular frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. **Open your browser:**
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:4200

### Option 2: Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - http://localhost:3000

### Option 3: Development with Docker

```bash
docker-compose --profile dev up --build
```

This will run the app on port 3001 with hot-reload for development.

## 📁 Project Structure

```
DEVOPS-Project/
├── server.js                 # Node.js backend server
├── package.json             # Backend dependencies
├── goals.db                 # SQLite database (created automatically)
├── frontend/                # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Angular components
│   │   │   ├── models/      # TypeScript interfaces
│   │   │   ├── services/    # API services
│   │   │   └── app.*.ts     # App configuration
│   │   ├── index.html       # Main HTML file
│   │   └── styles.css       # Global styles
│   ├── package.json         # Frontend dependencies
│   └── angular.json         # Angular configuration
├── Dockerfile               # Multi-stage Docker build
├── docker-compose.yml       # Docker Compose configuration
└── README.md                # This file
```

## 🔧 API Endpoints

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create a new goal
- `DELETE /api/goals/:id` - Delete a goal

### Progress
- `GET /api/goals/:id/progress` - Get progress for a specific goal
- `PUT /api/progress/:id` - Update progress for a specific day

## 🎨 UI Components

### Goals List
- Display all active goals
- Create new 30-day challenges
- View progress percentage
- Delete goals

### Goal Detail
- 30-day calendar grid
- Click to mark days as complete
- Progress statistics (streaks, completion rate)
- Date range display

## 🗄️ Database Schema

### Goals Table
```sql
CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Progress Table
```sql
CREATE TABLE progress (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL,
  date TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (goal_id) REFERENCES goals (id)
);
```

## 🚀 Deployment

### Production Build

1. **Build the Angular app:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

### Docker Production

```bash
# Build the production image
docker build -t goal-tracker .

# Run the container
docker run -p 3000:3000 -v $(pwd)/data:/app/data goal-tracker
```

## 🔒 Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## 🧪 Testing

```bash
# Run backend tests (if implemented)
npm test

# Run frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database locked:**
   - Ensure no other instances are running
   - Check file permissions on goals.db

3. **Angular build fails:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs

Check the console output for detailed error messages. The application includes comprehensive error handling and logging.

## 🎯 Future Enhancements

- User authentication and accounts
- Multiple goal types and categories
- Social sharing and challenges
- Mobile app (React Native)
- Advanced analytics and insights
- Goal templates and suggestions
- Email reminders and notifications

---

**Happy goal tracking! 🎉**
