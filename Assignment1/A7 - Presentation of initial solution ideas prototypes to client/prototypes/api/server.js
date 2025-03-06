const express = require('express');
const path = require('path');
const app = express();
const port = 4040;


var f_path = '../site/public/game/build'

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use((req, res, next) => {
    if (req.url.endsWith('.gz')) {
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Type', 'application/javascript');
    } else if (req.url.endsWith('.br')) {
        res.set('Content-Encoding', 'br');
        res.set('Content-Type', 'application/javascript');
    }
    next();
});
app.use(express.static(path.join(__dirname, f_path), {
    setHeaders: (res, path) => {
        if (path.endsWith('.gz')) {
            res.set('Content-Encoding', 'gzip');
            res.set('Content-Type', 'application/javascript');
        } else if (path.endsWith('.br')) {
            res.set('Content-Encoding', 'br');
            res.set('Content-Type', 'application/javascript');
        }
    }
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
