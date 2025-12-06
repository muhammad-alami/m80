import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function ReportsPage() {
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
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/reports-chart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          setError('Your session has expired. Please log in again.');
          setLoading(false);
          navigate('/login');
          return;
        }

        if (!response.ok) {
          setError('Could not load reports chart data.');
          setLoading(false);
          return;
        }

        const data = await response.json();

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
        console.error('Error fetching reports chart:', err);
        setError('Error fetching reports chart.');
        setLoading(false);
      }
    };

    fetchChart();
  }, [navigate]);

  return (
    <main aria-labelledby="reports-heading">
      <section>
        <h1 id="reports-heading">Reports</h1>

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
              aria-label="Reports chart comparing traditional screening and generative AI hit rates"
            >
              <ResponsiveContainer>
                <BarChart data={chartData.points}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="traditional"
                    name="Traditional screening (%)"
                    fill="#8884d8"
                  />
                  <Bar
                    dataKey="generative"
                    name="Generative AI (%)"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p style={{ marginTop: '1rem' }}>
              This chart uses illustrative percentages to compare how often
              traditional high-throughput screening produces active and lead
              antibiotic compounds versus the generative AI approach described
              in the article. It shows that, for a similar search space, the
              generative AI workflow can yield a higher fraction of active
              molecules and a greater chance of finding strong lead candidates.
            </p>

            <p>
              <strong>Source: </strong>
              <a
                href="https://www.fiercebiotech.com/research/deep-learning-generative-ai-models-build-new-antibiotics-starting-single-atom"
                target="_blank"
                rel="noreferrer"
              >
                Generative AI models build new antibiotics starting from a
                single atom (FierceBiotech)
              </a>
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default ReportsPage;
