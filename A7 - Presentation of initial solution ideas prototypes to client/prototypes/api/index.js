const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./database.db');

app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = 'key';

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS user_mood (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, mood TEXT, keywords TEXT, notes TEXT, visible_to_gps BOOLEAN, FOREIGN KEY(user_id) REFERENCES users(id))");
});
//=========================== Users ==========================
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Hashing error' });
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword, function (err) {
      if (err) {
        return res.status(500).json({ error: 'User registration failed' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err || !row) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    bcrypt.compare(password, row.password, (err, match) => {
      if (err || !match) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
      const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

app.get('/profile', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token required' });
  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) return res.status(401).json({ error: 'Token is malformed' });
  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    res.json({ message: 'Welcome to your profile!', user: decoded });
  });
});
//=========================== Moods ==========================
app.get('/userMoods', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token required' });
  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) return res.status(401).json({ error: 'Token is malformed' });
  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    const userId = decoded.id;
    db.all("SELECT * FROM user_mood WHERE user_id = ?", [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to retrieve mood data' });
      res.json({ moods: rows });
    });
  });
});

app.post('/saveMood', (req, res) => {
  const { mood, keywords, notes, visible_to_gps } = req.body;
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token required' });
  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) return res.status(401).json({ error: 'Token is malformed' });
  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') return res.status(403).json({ error: 'Token has expired' });
      return res.status(403).json({ error: 'Invalid token' });
    }
    const userId = decoded.id;
    const stmt = db.prepare("INSERT INTO user_mood (user_id, mood, keywords, notes, visible_to_gps) VALUES (?, ?, ?, ?, ?)");
    stmt.run(userId, mood, keywords, notes, visible_to_gps, function (err) {
      if (err) return res.status(500).json({ error: 'Failed to save mood data' });
      res.status(201).json({ message: 'Mood saved successfully' });
    });
  });
});
//=========================== Server ==========================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
