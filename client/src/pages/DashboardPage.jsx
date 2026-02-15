import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboard';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatsCards from '../components/dashboard/StatsCards';
import TodayTasks from '../components/dashboard/TodayTasks';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import ProductivityChart from '../components/dashboard/ProductivityChart';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getProductivity(30),
    ])
      .then(([statsData, prodData]) => {
        setStats(statsData);
        setProductivity(prodData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-greeting">
        <h2>Welcome back, {user?.name?.split(' ')[0]}!</h2>
        <p>Here's what's happening with your tasks.</p>
      </div>

      {stats && <StatsCards stats={stats} />}

      <div className="dashboard-grid">
        <TodayTasks />
        <UpcomingTasks />
      </div>

      <div className="dashboard-grid">
        {productivity && <ProductivityChart data={productivity.daily_completions} />}
        {productivity && <CategoryBreakdown data={productivity.category_breakdown} />}
      </div>

      {stats && stats.total_tasks > 0 && (
        <div className="dashboard-section" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-gray-600)', fontSize: 15 }}>
            Completion rate: <strong style={{ color: 'var(--color-primary)', fontSize: 24 }}>{stats.completion_rate}%</strong>
          </p>
        </div>
      )}
    </div>
  );
}
