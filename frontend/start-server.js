const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const buildDir = path.join(__dirname, 'build');

console.log('Starting server...');
console.log('Build directory:', buildDir);
console.log('Build directory exists:', fs.existsSync(buildDir));

// Middleware
app.use(express.static(buildDir));

// Routes
app.get('/', (req, res) => {
  const filePath = path.join(buildDir, 'index.html');
  console.log('Serving / -> ', filePath);
  res.sendFile(filePath);
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(buildDir, 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(buildDir, 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(buildDir, 'dashboard.html'));
});

// Fallback - must be last
app.use((req, res) => {
  console.log('Fallback route for:', req.path);
  res.sendFile(path.join(buildDir, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Error: ' + err.message);
});

// Start server
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`✓ Server listening on http://127.0.0.1:${PORT}`);
  console.log(`✓ Serving files from ${buildDir}`);
});

// Keep process alive
process.stdin.resume();
