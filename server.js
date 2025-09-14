const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend/dist/frontend')));

// Database setup
const db = new sqlite3.Database('./goals.db');

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    goal_id TEXT NOT NULL,
    date TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (goal_id) REFERENCES goals (id)
  )`);
});

// API Routes

// Health check endpoint for Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get all goals
app.get('/api/goals', (req, res) => {
  db.all('SELECT * FROM goals ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a new goal
app.post('/api/goals', (req, res) => {
  const { title, description } = req.body;
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const goal = {
    id: uuidv4(),
    title,
    description,
    start_date: startDate,
    end_date: endDate
  };

  db.run(
    'INSERT INTO goals (id, title, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
    [goal.id, goal.title, goal.description, goal.start_date, goal.end_date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Initialize progress for all 30 days
      const progressPromises = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        progressPromises.push(new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO progress (id, goal_id, date) VALUES (?, ?, ?)',
            [uuidv4(), goal.id, date],
            (err) => err ? reject(err) : resolve()
          );
        }));
      }

      Promise.all(progressPromises)
        .then(() => {
          res.status(201).json(goal);
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    }
  );
});

// Get progress for a specific goal
app.get('/api/goals/:id/progress', (req, res) => {
  const { id } = req.params;
  
  db.all(
    'SELECT * FROM progress WHERE goal_id = ? ORDER BY date',
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Update progress for a specific day
app.put('/api/progress/:id', (req, res) => {
  const { id } = req.params;
  const { completed, notes } = req.body;
  
  db.run(
    'UPDATE progress SET completed = ?, notes = ? WHERE id = ?',
    [completed ? 1 : 0, notes || null, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Progress updated successfully' });
    }
  );
});

// Delete a goal
app.delete('/api/goals/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM progress WHERE goal_id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    db.run('DELETE FROM goals WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Goal deleted successfully' });
    });
  });
});

// Serve Angular app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/frontend/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database initialized: goals.db`);
});
