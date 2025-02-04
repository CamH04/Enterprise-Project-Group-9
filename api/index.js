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

const JWT_SECRET = 'your_jwt_secret_key';

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
});

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
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    res.json({ message: 'Welcome to your profile!', user: decoded });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
