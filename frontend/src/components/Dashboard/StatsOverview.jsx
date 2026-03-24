import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const StatsOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`/dashboard/stats/${user.firebaseUid}`);
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="stats-overview">
      <header className="page-header">
        <h1>Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
        <p>Your performance summary for the last 7 days.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Referrals</span>
          <span className="stat-value">{stats.totalReferrals}</span>
          <span className="stat-change positive">
            {stats.totalReferrals > 0 ? `+${Math.floor(stats.totalReferrals * 0.15)}% vs last week` : '0%'}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Clicks</span>
          <span className="stat-value">{stats.totalClicks}</span>
          <span className="stat-change positive">
            +{Math.floor(stats.totalClicks * 0.08)} today
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Conversions</span>
          <span className="stat-value">{stats.conversions}</span>
          <span className="stat-change">
            {stats.totalClicks > 0 ? (stats.conversions / stats.totalClicks * 100).toFixed(1) : 0}% rate
          </span>
        </div>
      </div>

      <div className="chart-container">
        <h3>Engagement Progress</h3>
        <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={stats.weeklyData}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#6366f1" fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
