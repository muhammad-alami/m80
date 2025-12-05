import { useEffect, useState } from 'react';
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

function ReportsPage() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:3000/api/reports-chart', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError('Could not load reports chart data.');
          setLoading(false);
          return;
        }

        const data = await response.json();

        // Build data objects: [{ name, traditional, generative }, ...]
        const points = (data.labels || []).map((label, index) => ({
          name: label,
          traditional: data.traditional ? data.traditional[index] : 0,
          generative: data.generative ? data.generative[index] : 0,
        }));

        setChartData({
          title: data.title,
          description: data.description,
          points,
        });
        setLoading(false);
      } catch (err) {
        setError('Error fetching reports chart.');
        setLoading(false);
      }
    };

    fetchChart();
  }, []);

  return (
    <section>
      <h2>Reports</h2>

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
            aria-label="Reports chart comparing traditional and generative AI hit rates"
          >
            <ResponsiveContainer>
              <BarChart data={chartData.points}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="traditional" name="Traditional (%)" />
                <Bar dataKey="generative" name="Generative AI (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p>
            {chartData.description}{' '}
            This chart compares the approximate hit rates of traditional high-throughput screening
            methods with the generative AI pipeline described in the article.
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

export default ReportsPage;
