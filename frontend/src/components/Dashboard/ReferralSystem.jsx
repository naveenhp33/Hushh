import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import './Dashboard.css';

const ReferralSystem = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const referralLink = `${window.location.origin}/join/${user?.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="referral-page">
      <header className="page-header">
         <h1>Referral Hub 🔗</h1>
         <p>Invite your network and climb the leaderboard.</p>
      </header>

      <div className="referral-card-main">
         <div className="link-section">
             <label>Your Unique Referral Link</label>
             <div className="link-box">
                <input type="text" value={referralLink} readOnly />
                <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
             </div>
         </div>

         <div className="share-grid">
             <div className="share-option">
                <span>Spread the word on WhatsApp, LinkedIn, or Instagram.</span>
             </div>
         </div>
      </div>

      <div className="stats-grid mini">
         <div className="stat-card">
             <span className="stat-label">Total Clicks</span>
             <span className="stat-value">256</span>
         </div>
         <div className="stat-card">
             <span className="stat-label">Signups</span>
             <span className="stat-value">18</span>
         </div>
         <div className="stat-card">
             <span className="stat-label">Earnings</span>
             <span className="stat-value">$45.00</span>
         </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
