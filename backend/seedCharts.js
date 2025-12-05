// seedCharts.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/m80';

// Same schema as in server.js
const chartSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: String,
  labels: [String],
  values: [Number],
  traditional: [Number],
  generative: [Number],
  description: String
});

const Chart = mongoose.model('Chart', chartSchema);

// Chart data from our antibiotics topic

const summaryChartData = {
  key: 'summary',
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

const reportsChartData = {
  key: 'reports',
  title: 'Hit Rates: Traditional Screening vs Generative AI Antibiotic Design',
  labels: ['Active hits (%)', 'Lead compounds (%)'],
  traditional: [1.0, 0.3],
  generative: [2.3, 0.7],
  description:
    'Illustrative comparison of success rates in antibiotic discovery. Traditional high-throughput screening yields relatively few active or lead compounds per 300 candidates, while the generative AI approach in the study produced more active molecules and two strong leads from a similar search space.'
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Upsert summary chart
    await Chart.findOneAndUpdate(
      { key: 'summary' },
      summaryChartData,
      { upsert: true, new: true }
    );

    // Upsert reports chart
    await Chart.findOneAndUpdate(
      { key: 'reports' },
      reportsChartData,
      { upsert: true, new: true }
    );

    console.log('Charts seeded successfully');
  } catch (err) {
    console.error('Error seeding charts:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
