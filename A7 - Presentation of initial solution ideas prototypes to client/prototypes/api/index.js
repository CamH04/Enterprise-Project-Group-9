const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');
const JWT_SECRET = 'key';
const articlesDirectory = path.join(__dirname, 'articles');

app.use(cors());
app.use(bodyParser.json());

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS user_mood (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, mood TEXT, keywords TEXT, notes TEXT, visible_to_gps BOOLEAN, FOREIGN KEY(user_id) REFERENCES users(id))");
});
//=========================== Users ==========================
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log('Error hashing password:', err);
      return res.status(500).json({ error: 'Hashing error' });
    }
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword, function (err) {
      if (err) {
        console.log('Error during user registration:', err);
        return res.status(500).json({ error: 'User registration failed' });
      }
      console.log('User registered successfully:', username);
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err || !row) {
      console.log('Error or invalid username:', err);
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    bcrypt.compare(password, row.password, (err, match) => {
      if (err || !match) {
        console.log('Password mismatch or error:', err);
        return res.status(400).json({ error: 'Invalid username or password' });
      }
      const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '1h' });
      console.log('User logged in, token generated:', row.username);
      res.json({ token });
    });
  });
});

app.get('/profile', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Token required' });
  }
  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) {
    console.log('Token is malformed');
    return res.status(401).json({ error: 'Token is malformed' });
  }
  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Invalid or expired token');
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    console.log('Token verified, user:', decoded.username);
    res.json({ message: 'Welcome to your profile!', user: decoded });
  });
});
//=========================== Moods ==========================
app.get('/userMoods', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Token required' });
  }
  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) {
    console.log('Token is malformed');
    return res.status(401).json({ error: 'Token is malformed' });
  }
  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Invalid or expired token');
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    const userId = decoded.id;
    console.log('User ID:', userId);
    db.all("SELECT * FROM user_mood WHERE user_id = ?", [userId], (err, rows) => {
      if (err) {
        console.log('Error fetching moods:', err);
        return res.status(500).json({ error: 'Failed to retrieve mood data' });
      }
      console.log('Moods retrieved:', rows.length);
      res.json({ moods: rows });
    });
  });
});

app.post('/saveMood', (req, res) => {
  const { mood, keywords, notes, visible_to_gps } = req.body;
  const token = req.headers['authorization'];
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Token required' });
  }
  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) {
    console.log('Token is malformed');
    return res.status(401).json({ error: 'Token is malformed' });
  }
  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.log('Token expired');
        return res.status(403).json({ error: 'Token has expired' });
      }
      console.log('Invalid token');
      return res.status(403).json({ error: 'Invalid token' });
    }
    const userId = decoded.id;
    console.log('Saving mood for user ID:', userId);
    const stmt = db.prepare("INSERT INTO user_mood (user_id, mood, keywords, notes, visible_to_gps) VALUES (?, ?, ?, ?, ?)");
    stmt.run(userId, mood, keywords, notes, visible_to_gps, function (err) {
      if (err) {
        console.log('Error saving mood data:', err);
        return res.status(500).json({ error: 'Failed to save mood data' });
      }
      console.log('Mood saved successfully for user ID:', userId);
      res.status(201).json({ message: 'Mood saved successfully' });
    });
  });
});

//=========================== Articles ==========================
app.get('/recommendedArticles', (req, res) => {
  const { keywords } = req.query;
  if (!keywords) {
    console.log('No keywords provided');
    return res.status(400).json({ error: 'No keywords provided' });
  }
  const keywordArray = keywords.split(',').map((keyword) => keyword.trim().toLowerCase());
  console.log('Received keywords for article recommendation:', keywordArray);

  fs.readdir(articlesDirectory, (err, files) => {
    if (err) {
      console.log('Error reading articles directory:', err);
      return res.status(500).json({ error: 'Failed to read articles directory' });
    }
    let recommendedArticles = [];
    files.forEach((file) => {
      const filePath = path.join(articlesDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8').toLowerCase();
      const articleMatch = keywordArray.some((keyword) => fileContent.includes(keyword));
      if (articleMatch) {
        recommendedArticles.push({
          title: file.replace('.txt', ''),
          content: fileContent,
        });
      }
    });

    if (recommendedArticles.length > 0) {
      console.log('Articles recommended:', recommendedArticles);
      res.json({ recommendedArticles });
    } else {
      console.log('No articles matched the keywords');
      res.json({ recommendedArticles: [] });
    }
  });
});


//=========================== Server ==========================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
