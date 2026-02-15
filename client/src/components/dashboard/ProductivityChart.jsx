import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './DashboardSection.css';

export default function ProductivityChart({ data }) {
  if (!data || data.length === 0) return null;

  // Show last 14 days for a cleaner chart
  const chartData = data.slice(-14).map((d) => ({
    ...d,
    date: d.date.slice(5), // MM-DD format
  }));

  return (
    <div className="dashboard-section">
      <h3 className="section-title" style={{ marginBottom: 16 }}>Productivity Trend (14 days)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} />
          <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
          />
          <Legend />
          <Line type="monotone" dataKey="completed" stroke="#6366F1" strokeWidth={2} dot={false} name="Completed" />
          <Line type="monotone" dataKey="created" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Created" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
