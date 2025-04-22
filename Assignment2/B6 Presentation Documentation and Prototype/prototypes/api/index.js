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
  db.run("CREATE TABLE IF NOT EXISTS user_mood (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, mood TEXT, keywords TEXT, notes TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id))");
  db.run(`   CREATE TABLE IF NOT EXISTS user_wrap (     id INTEGER PRIMARY KEY AUTOINCREMENT,     user_id INTEGER,     wellness_tools TEXT,     triggers TEXT,     early_warning_signs TEXT,     when_things_break_down TEXT,     crisis_plan TEXT,     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,     FOREIGN KEY(user_id) REFERENCES users(id)   ) `);
  db.run(`CREATE TABLE IF NOT EXISTS pets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  pet_name TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`);

});
//=========================== Pets ==========================
app.post('/savePetName', (req, res) => {
  const { petName } = req.body;
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token required' });
  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) return res.status(401).json({ error: 'Token malformed' });
  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token, Please Login' });
    const userId = decoded.id;
    const stmt = db.prepare("INSERT INTO pets (user_id, pet_name) VALUES (?, ?)");
    stmt.run(userId, petName, function (err) {
      if (err) return res.status(500).json({ error: 'Failed to save pet name' });
      res.status(201).json({ message: 'Pet name saved successfully' });
    });
  });
});
app.get('/getPetName', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token required' });
  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) return res.status(401).json({ error: 'Token malformed' });

  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    const userId = decoded.id;
    db.get("SELECT pet_name FROM pets WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1", [userId], (err, row) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch pet name' });
      if (!row) return res.status(404).json({ error: 'Pet not found' });
      res.json({ petName: row.pet_name });
    });
  });
});
app.put('/updatePetName', (req, res) => {
  const { petName } = req.body;
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token required' });
  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) return res.status(401).json({ error: 'Token malformed' });
  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    const userId = decoded.id;
    db.run(
      `UPDATE pets SET pet_name = ?, timestamp = CURRENT_TIMESTAMP WHERE user_id = ?`,
      [petName, userId],
      function (err) {
        if (err) return res.status(500).json({ error: 'Failed to update pet name' });
        if (this.changes === 0) {
          db.run(
            "INSERT INTO pets (user_id, pet_name) VALUES (?, ?)",
            [userId, petName],
            (insertErr) => {
              if (insertErr) return res.status(500).json({ error: 'Failed to insert pet name' });
              res.status(200).json({ message: 'Pet name saved successfully' });
            }
          );
        } else {
          res.status(200).json({ message: 'Pet name updated successfully' });
        }
      }
    );
  });
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
app.post('/reset-password', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'User not found' });
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password' });
      }
      db.run('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to reset password' });
        }
        res.json({ message: 'Password reset successfully' });
      });
    });
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
    db.all("SELECT id, mood, keywords, notes, timestamp FROM user_mood WHERE user_id = ?", [userId], (err, rows) => {
      if (err) {
        console.log('Error fetching moods:', err);
        return res.status(500).json({ error: 'Failed to retrieve mood data' });
      }
      console.log('Moods retrieved:', rows.length);
      console.log('===========================================');
      res.json({ moods: rows });
    });
  });
});
app.post('/saveMood', (req, res) => {
  const { mood, keywords, notes } = req.body;
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
    const stmt = db.prepare("INSERT INTO user_mood (user_id, mood, keywords, notes) VALUES (?, ?, ?, ?)");
    stmt.run(userId, mood, keywords, notes, function (err) {
      if (err) {
        console.log('Error saving mood data:', err);
        return res.status(500).json({ error: 'Failed to save mood data' });
      }
      console.log('Mood saved successfully for user ID:', userId);
      res.status(201).json({ message: 'Mood saved successfully' });
    });
  });
});

/*=========================== Wrap ==========================*/
app.post('/saveWRAP', (req, res) => {
  const { wellnessTools, triggers, earlyWarningSigns, whenThingsBreakDown, crisisPlan } = req.body;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) {
    return res.status(401).json({ error: 'Token is malformed' });
  }

  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.id;
    const stmt = db.prepare(`
      INSERT INTO user_wrap (
        user_id, wellness_tools, triggers, early_warning_signs, when_things_break_down, crisis_plan
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(userId, wellnessTools, triggers, earlyWarningSigns, whenThingsBreakDown, crisisPlan, function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save WRAP data' });
      }
      res.status(201).json({ message: 'WRAP saved successfully' });
    });
  });
});
app.get('/userWRAP', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) {
    return res.status(401).json({ error: 'Token is malformed' });
  }

  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.id;
    console.log('Fetching WRAP data for user ID:', userId);

    db.get("SELECT * FROM user_wrap WHERE user_id = ?", [userId], (err, row) => {
      if (err) {
        console.log('Error fetching WRAP data:', err);
        return res.status(500).json({ error: 'Failed to retrieve WRAP data' });
      }

      if (!row) {
        return res.status(404).json({ error: 'To See Your Profile Please Fill Out A WRAP plan and a Mood Tracker' });
      }

      console.log('WRAP data retrieved:', row);
      res.json({ wrapData: row });
    });
  });
});
app.put('/updateWRAP', (req, res) => {
  const { wellnessTools, triggers, earlyWarningSigns, whenThingsBreakDown, crisisPlan } = req.body;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  const tokenWithoutBearer = token.split(' ')[1];
  if (!tokenWithoutBearer) {
    return res.status(401).json({ error: 'Token is malformed' });
  }

  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.id;

    db.run(
      `UPDATE user_wrap
       SET wellness_tools = ?, triggers = ?, early_warning_signs = ?,
           when_things_break_down = ?, crisis_plan = ?, timestamp = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [wellnessTools, triggers, earlyWarningSigns, whenThingsBreakDown, crisisPlan, userId],
      function (err) {
        if (err) {
          console.log('Error updating WRAP data:', err);
          return res.status(500).json({ error: 'Failed to update WRAP data' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'No WRAP data found for this user' });
        }

        res.status(200).json({ message: 'WRAP updated successfully' });
      }
    );
  });
});



/*=========================== Articles ==========================
 *    Description of how a article becomes recommended:
 *    1. - Keywords are served to backend
 *    2. - Backend looks through articles and ranks articles by
 *    counting how many keyword matches occur in its content, ignoring stop words
 *    3. - Sort the articles based on the match count
 *    4. - Return top article
*/
const stopWords = [
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'so', 'yet', 'on', 'at', 'by', 'with', 'as', 'from', 'of', 'to', 'in', 'that', 'which', 'who', 'whom', 'whose', 'this', 'these', 'those', 'it', 'its', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'cannot', 'cannot' , 'i', 'I' , 'want' , 'Want'
];
function filterStopWords(words) {
  return words.filter(word => !stopWords.includes(word));
}

app.get('/recommendedArticles', (req, res) => {
  const { keywords } = req.query;
  if (!keywords) {
    console.log('No keywords provided');
    return res.status(400).json({ error: 'No keywords provided' });
  }
  const keywordArray = filterStopWords(keywords.split(',').map((keyword) => keyword.trim().toLowerCase()));
  console.log('Received keywords for article recommendation:', keywordArray);
  fs.readdir(articlesDirectory, (err, files) => {
    if (err) {
      console.log('Error reading articles directory:', err);
      return res.status(500).json({ error: 'Failed to read articles directory' });
    }
    let articleScores = [];
    files.forEach((file) => {
      const filePath = path.join(articlesDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8').toLowerCase();
      const contentWords = filterStopWords(fileContent.split(/\W+/));
      let matchCount = 0;
      keywordArray.forEach((keyword) => {
        if (contentWords.includes(keyword)) {
          matchCount++;
        }
      });
      if (matchCount > 0) {
        articleScores.push({
          title: file.replace('.txt', ''),
          content: fileContent,
          matchCount,
        });
      }
    });
    const mostRelevantArticle = articleScores.sort((a, b) => b.matchCount - a.matchCount)[0];
    if (mostRelevantArticle) {
      res.json({ recommendedArticles: [mostRelevantArticle] });
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
