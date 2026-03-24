import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatsOverview from './StatsOverview';
import Leaderboard from './Leaderboard';
import ReferralSystem from './ReferralSystem';
import ActivationTracker from './ActivationTracker';
import ReEngagement from './ReEngagement';
import Rewards from './Rewards';
import MarketingToolkit from './MarketingToolkit';
import CommunityHub from './CommunityHub';
import ProfileSettings from './ProfileSettings';
import AboutHushAI from './AboutHushAI';
import WelcomeModal from './WelcomeModal';
import axios from '../../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Track dashboard entry
    axios.post('/analytics/track', {
      uid: user?.firebaseUid,
      event: 'dashboard',
      step: 'entry'
    });
  }, [user]);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: '📊' },
    { name: 'Activation', path: '/dashboard/activation', icon: '⚡' },
    { name: 'Referrals', path: '/dashboard/referrals', icon: '🔗' },
    { name: 'Toolkit', path: '/dashboard/toolkit', icon: '🧰' },
    { name: 'Community', path: '/dashboard/community', icon: '🌍' },
    { name: 'Rewards', path: '/dashboard/rewards', icon: '🎁' },
    { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: '🏆' },
    { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
    { name: 'About Hush AI', path: '/dashboard/about', icon: '💡' },
  ];

  return (
    <div className="dashboard-layout">
      <WelcomeModal user={user} />
      <ReEngagement />
      
      <main className="dashboard-content">
        <Routes>
          <Route index element={<StatsOverview />} />
          <Route path="activation" element={<ActivationTracker />} />
          <Route path="referrals" element={<ReferralSystem />} />
          <Route path="toolkit" element={<MarketingToolkit />} />
          <Route path="community" element={<CommunityHub />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="about" element={<AboutHushAI />} />
        </Routes>
      </main>

      <aside className="sidebar">
        <div className="sidebar-brand">
           <h2>Hush AI 🚀</h2>
           <span className="badge">Ambassador</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-banner">
             <img src={user?.photoURL || 'https://via.placeholder.com/40'} alt="Avatar" />
             <div className="user-text">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.college || 'Ambassador'}</span>
             </div>
          </div>
          <button onClick={logout} className="logout-btn">Log Out 🚪</button>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
