import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config.js';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

function SummaryPage() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('You must be logged in to see this chart.');
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/summary-chart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError('Could not load summary chart data.');
          setLoading(false);
          return;
        }

        const data = await response.json();

        // Build points using "value" since BarChart expects dataKey="value"
        const points = (data.labels || []).map((label, idx) => ({
          name: label,
          value: data.values ? data.values[idx] : 0
        }));

        setChartData({
          title: data.title,
          description: data.description,
          points
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching summary chart:', err);
        setError('Error fetching summary chart.');
        setLoading(false);
      }
    };

    fetchChart();
  }, [navigate]);

  return (
    <section aria-labelledby="summary-heading">
      <h1 id="summary-heading">Summary</h1>

      {loading && <p>Loading chart...</p>}

      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {!loading && !error && chartData && (
        <>
          <h3>{chartData.title}</h3>

          <div
            style={{ width: '100%', height: 300 }}
            aria-label="Summary chart showing the AI-designed antibiotic pipeline from the article"
          >
            <ResponsiveContainer>
              <BarChart data={chartData.points}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Number of molecules"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p style={{ marginTop: '1rem' }}>
            This bar chart summarizes the AI-designed antibiotic pipeline
            described in the source article. It shows how hundreds of virtual
            molecules were evaluated by a generative AI model, how many of them
            looked synthesizable, how many were actually made in the lab, how
            many showed antibacterial activity, and finally how two molecules
            (NG1 and DN1) emerged as lead drug candidates.
          </p>

          <p>
            <strong>Source: </strong>
            <a
              href="https://www.fiercebiotech.com/research/deep-learning-generative-ai-models-build-new-antibiotics-starting-single-atom"
              target="_blank"
              rel="noreferrer"
            >
              Generative AI models build new antibiotics starting from a single
              atom (FierceBiotech)
            </a>
          </p>
        </>
      )}
    </section>
  );
}

export default SummaryPage;
