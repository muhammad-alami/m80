// if .env is present, load environment variables from it
require('dotenv').config();

// import libraries
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const app = express();

// middleware
app.use(cors());
app.use(express.json());

// If PORT is not set, it falls back (||) to 3000.
const PORT = process.env.PORT || 3000;


const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';


const VALID_USERNAME = 'Muhammad';
const VALID_PASSWORD = 'Muhammad';


// Chart data for the M80 antibiotics story

// Data for the Summary page
const summaryChartData = {
  title: 'AI-Designed Antibiotics: From Virtual Candidates to Lead Drugs',
  labels: [
    'AI candidates evaluated',
    'Synthesizable candidates',
    'Synthesized in lab',
    'Active compounds',
    'Lead compounds (NG1 & DN1)'
  ],
  values: [300, 80, 24, 7, 2],
  description:
    'Pipeline inspired by the antibiotics study: hundreds of AI-designed molecules were evaluated in silico, a subset looked synthesizable, 24 were made in the lab, 7 showed antibacterial activity, and 2 (NG1 and DN1) emerged as lead candidates.'
};

// Data for the Reports page chart
const reportsChartData = {
  title: 'Hit Rates: Traditional Screening vs Generative AI Antibiotic Design',
  labels: ['Active hits (%)', 'Lead compounds (%)'],
  traditional: [1.0, 0.3],
  generative: [2.3, 0.7],
  description:
    'Illustrative comparison of success rates in antibiotic discovery. Traditional screening yields relatively few active or lead compounds per 300 candidates, while the generative AI approach in the study produced more active molecules and two strong leads from a similar search space.'
};



// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/m80';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Simple Chart schema and model
const chartSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // 'summary' or 'reports'
  title: String,
  labels: [String],
  values: [Number],
  traditional: [Number],
  generative: [Number],
  description: String
});

const Chart = mongoose.model('Chart', chartSchema);




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


// Summary chart endpoint (protected, reads from Mongo)
app.get('/api/summary-chart', authenticateToken, async (req, res) => {
  try {
    const chart = await Chart.findOne({ key: 'summary' }).lean();

    if (!chart) {
      return res.status(404).json({ error: 'Summary chart not found' });
    }

    res.json(chart);
  } catch (err) {
    console.error('Error fetching summary chart:', err);
    res.status(500).json({ error: 'Server error fetching summary chart' });
  }
});

// Reports chart endpoint (protected, reads from Mongo)
app.get('/api/reports-chart', authenticateToken, async (req, res) => {
  try {
    const chart = await Chart.findOne({ key: 'reports' }).lean();

    if (!chart) {
      return res.status(404).json({ error: 'Reports chart not found' });
    }

    res.json(chart);
  } catch (err) {
    console.error('Error fetching reports chart:', err);
    res.status(500).json({ error: 'Server error fetching reports chart' });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`M80 backend listening on port ${PORT}`);
});
