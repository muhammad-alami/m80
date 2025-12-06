require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/m80';

const chartSchema = new mongoose.Schema({
  key: String,
  title: String,
  labels: [String],
  values: [Number],
  traditional: [Number],
  generative: [Number],
  description: String
});

const Chart = mongoose.model('Chart', chartSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);

  await Chart.deleteMany({});

  await Chart.create([
    {
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
        'Pipeline inspired by the antibiotics study.'
    },
    {
      key: 'reports',
      title: 'Hit Rates: Traditional Screening vs Generative AI',
      labels: ['Active hits (%)', 'Lead compounds (%)'],
      traditional: [1.0, 0.3],
      generative: [2.3, 0.7],
      description:
        'Comparison of traditional vs AI-driven hit rates.'
    }
  ]);

  console.log('Charts seeded!');
  await mongoose.disconnect();
}

seed();
