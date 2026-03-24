import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './AdminPanel.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [ambassadors, setAmbassadors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ambRes, statRes] = await Promise.all([
          axios.get('/admin/ambassadors'),
          axios.get('/admin/stats')
        ]);
        setAmbassadors(ambRes.data.ambassadors || []);
        setStats(statRes.data || {});
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#60a5fa', '#c084fc', '#4ade80', '#fbbf24', '#f87171'];

  const filteredAmbassadors = ambassadors.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.college && a.college.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="admin-loading">Loading Admin Panel...</div>;

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="header-content">
          <div>
            <h1>Hush AI Central Command 🛰️</h1>
            <p>Manage and track your fleet of ambassadors</p>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="stats-grid">
         <div className="stat-card">
            <h3>Total Ambassadors</h3>
            <p className="stat-value">{stats?.totalAmbassadors || 0}</p>
         </div>
         <div className="stat-card">
            <h3>Total Clicks</h3>
            <p className="stat-value">{stats?.totalClicks || 0}</p>
         </div>
         <div className="stat-card">
            <h3>Total Signups</h3>
            <p className="stat-value highlight">{stats?.totalSignups || 0}</p>
         </div>
      </div>

      <div className="charts-section">
         <div className="chart-card">
            <h3>College Distribution</h3>
            <div className="chart-wrapper">
               <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                     <Pie
                        data={stats?.collegeBreakdown?.map(c => ({ name: c._id || 'Unknown', value: c.count }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {stats?.collegeBreakdown?.map((_, i) => (
                           <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                     </Pie>
                     <ReTooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="table-controls">
         <input 
           type="text" 
           placeholder="Search by name, email, or college..." 
           className="admin-search-bar"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
         <button 
           className="export-csv-btn" 
           onClick={() => {
             const headers = "Name,Email,College,Clicks,Signups,Referral Code\n";
             const csv = ambassadors.map(a => `${a.name},${a.email},${a.college || 'N/A'},${a.stats?.clicks || 0},${a.stats?.signups || 0},${a.referralCode}`).join("\n");
             const blob = new Blob([headers + csv], { type: 'text/csv' });
             const url = window.URL.createObjectURL(blob);
             const a = document.createElement('a');
             a.href = url;
             a.download = "ambassadors_data.csv";
             a.click();
           }}
         >
           Download CSV ⬇️
         </button>
      </div>

      <div className="ambassador-list-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ambassador</th>
              <th>Joined Date</th>
              <th>College</th>
              <th>Engagement</th>
              <th>Active Recruits</th>
              <th>Performance</th>
              <th>Last Seen</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAmbassadors.map(ambassador => {
              const clicks = ambassador.stats?.clicks || 0;
              const signups = ambassador.stats?.signups || 0;
              const ratio = clicks > 0 ? ((signups / clicks) * 100).toFixed(1) : 0;
              const lastSeen = ambassador.lastActivity?.timestamp || ambassador.lastActive;
              
              return (
                <tr key={ambassador._id}>
                  <td>
                    <div className="user-info">
                      <img src={ambassador.photoURL || 'https://via.placeholder.com/32'} alt="" />
                      <div>
                        <p className="name">{ambassador.name}</p>
                        <p className="email">{ambassador.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="date-cell">{new Date(ambassador.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td>
                    <span className="college-tag">{ambassador.college || 'Unassigned'}</span>
                  </td>
                  <td>
                    <div className="mini-stats">
                       <span>🖱️ {clicks} clicks</span>
                    </div>
                  </td>
                  <td>
                    <div className="recruit-stats">
                       <span className="count">{signups}</span>
                       <span className="label">Users</span>
                    </div>
                  </td>
                  <td>
                    <div className="performance-cell">
                       <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${Math.min(ratio * 2, 100)}%` }}></div>
                       </div>
                       <span className="ratio-text">{ratio}% Conv.</span>
                    </div>
                  </td>
                  <td>
                    <span className="last-seen">
                      {lastSeen ? (Date.now() - new Date(lastSeen).getTime()) < 5 * 60 * 1000 ? '🟢 Online' : new Date(lastSeen).toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true }) : '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${ambassador.onboardingComplete ? 'success' : 'pending'}`}>
                       {ambassador.onboardingComplete ? 'Onboarded' : 'Incomplete'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
