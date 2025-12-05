import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function SummaryPage() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_BASE_URL}/summary-chart`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError('Could not load summary chart data.');
          setLoading(false);
          return;
        }

        const data = await response.json();

        // Transform labels + values into Recharts format: [{ name, value }, ...]
        const points = (data.labels || []).map((label, index) => ({
          name: label,
          value: data.values ? data.values[index] : 0,
        }));

        setChartData({
          title: data.title,
          description: data.description,
          points,
        });
        setLoading(false);
      } catch (err) {
        setError('Error fetching summary chart.');
        setLoading(false);
      }
    };

    fetchChart();
  }, []);

  return (
    <section>
      <h2>Summary</h2>

      {loading && <p>Loading chart...</p>}

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
            aria-label="Summary chart showing AI-designed antibiotic pipeline"
          >
            <ResponsiveContainer>
              <BarChart data={chartData.points}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Number of molecules" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p>
            {chartData.description}{' '}
            This visualization is based on the generative AI antibiotic design study described in
            the source article.
          </p>

          <p>
            Source:{' '}
            <a
              href="https://www.fiercebiotech.com/research/deep-learning-generative-ai-models-build-new-antibiotics-starting-single-atom"
              target="_blank"
              rel="noreferrer"
            >
              Generative AI models build new antibiotics starting from a single atom
            </a>
            .
          </p>
        </>
      )}
    </section>
  );
}

export default SummaryPage;
