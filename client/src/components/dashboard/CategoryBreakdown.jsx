import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './DashboardSection.css';

export default function CategoryBreakdown({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="dashboard-section">
      <h3 className="section-title" style={{ marginBottom: 16 }}>Tasks by Category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fill: '#374151' }} width={100} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Tasks">
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color || '#6366F1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
