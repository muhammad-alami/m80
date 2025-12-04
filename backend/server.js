// if .env is present, load environment variables from it
require('dotenv').config();

// import libraries
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// If PORT is not set, it falls back (||) to 3000.
const PORT = process.env.PORT || 3000;


const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';


const VALID_USERNAME = 'Muhammad';
const VALID_PASSWORD = 'Muhammad';

// hardcoded chart data
// Example chart data for Summary page
const summaryChartData = {
  title: 'Example Summary Chart: Monthly Usage of M80 AI Tool',
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  values: [10, 25, 40, 60, 80]
};

// Example chart data for Reports page
const reportsChartData = {
  title: 'Example Reports Chart: Model Accuracy Over Versions',
  labels: ['v1', 'v2', 'v3', 'v4'],
  values: [70, 78, 85, 90]
};


//health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'M80 backend is running' });
});



// Login route - returns a JWT if credentials are correct
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  
  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  
  const payload = { username };

  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  
  res.json({ token });
});

// Middleware to check JWT on protected routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];   // like "Bearer <token>"

  // If no header, user is not authorized
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  // Expect header format: "Bearer tokenvalue"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid Authorization format' });
  }

  const token = parts[1];

  // Verify the token using our secret
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Token invalid or expired
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach decoded user to request object for later use
    req.user = user;
    next(); // move on to the next middleware/route handler
  });
}

// Example protected route to test auth
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'You accessed a protected route!',
    user: req.user
  });
});

// Summary chart endpoint (protected)
app.get('/api/summary-chart', authenticateToken, (req, res) => {
  res.json(summaryChartData);
});

//Reports chart endpoint (protected)
app.get('/api/reports-chart', authenticateToken, (req, res) => {
  res.json(reportsChartData);
});


// Start the server
app.listen(PORT, () => {
  console.log(`M80 backend listening on port ${PORT}`);
});