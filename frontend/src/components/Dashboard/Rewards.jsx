import React, { useState, useEffect } from 'react';
import './Rewards.css';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';

const Rewards = () => {
  const { user } = useAuth();
  const [currentSignups, setCurrentSignups] = useState(0);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCongrats, setShowCongrats] = useState(null); // stores the tier object

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`/dashboard/stats/${user.firebaseUid}`);
        setCurrentSignups(data.totalReferrals || 0);
        
        // Also need to get claimedRewards from the user object via a fresh fetch or just use what we have
        // Let's assume the /stats/ endpoint or a separate /me/ endpoint provides it.
        // I'll update the getStats controller to return it.
        setClaimedRewards(data.claimedRewards || []);
      } catch (err) {
        console.error('Error fetching rewards stats:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.firebaseUid) fetchStats();
  }, [user]);

  const handleClaim = async (tier) => {
    try {
      const { data } = await axios.post(`/dashboard/claim-reward/${user.firebaseUid}`, {
        level: tier.level
      });
      if (data.success) {
        setClaimedRewards(data.claimedRewards);
        setShowCongrats(tier);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to claim reward');
    }
  };

  const tiers = [
    {
      level: 1,
      target: 5,
      title: 'Hush AI Premium 🚀',
      desc: '1 Month completely free. Level up your AI game!',
      emoji: '🌟',
    },
    {
      level: 2,
      target: 25,
      title: 'Ambassador Swag Box 👕',
      desc: 'Exclusive T-shirts, premium stickers, and more sent to your college.',
      emoji: '🎁',
    },
    {
      level: 3,
      target: 100,
      title: 'Guaranteed Interview 🤝',
      desc: 'Skip the line! Get a guaranteed interview for our paid Summer Internship program.',
      emoji: '💼',
    },
    {
      level: 4,
      target: 500,
      title: 'MacBook Air M3 💻',
      desc: 'The ultimate creator tool, yours free for hitting the top milestone.',
      emoji: '💻',
    }
  ];

  if (loading) return <div className="loading">Loading milestones...</div>;

  return (
    <div className="rewards-page">
      {showCongrats && (
        <div className="congrats-overlay" onClick={() => setShowCongrats(null)}>
           <div className="congrats-modal" onClick={e => e.stopPropagation()}>
              <div className="confetti-effect">🎉 ✨ 🎊</div>
              <h2>Congratulations!</h2>
              <p>You've successfully claimed your</p>
              <h3>{showCongrats.title}</h3>
              <div className="congrats-icon">{showCongrats.emoji}</div>
              <p className="subtext">Our team will contact you via email for delivery details.</p>
              <button className="primary-btn" onClick={() => setShowCongrats(null)}>Awesome!</button>
           </div>
        </div>
      )}

      <header className="page-header">
         <h1>Rewards & Milestones 🎁</h1>
         <p>Unlock premium perks as you introduce Hush AI to your campus.</p>
      </header>

      <div className="rewards-progress-panel">
         <h3>Your Current Progress</h3>
         <div className="big-pulse-circle">
            <span className="count">{currentSignups}</span>
            <span className="label">Recruits</span>
         </div>
         <p>Keep sharing your link to hit the next tier!</p>
      </div>

      <div className="tiers-grid">
         {tiers.map((tier) => {
           const isUnlocked = currentSignups >= tier.target;
           const isClaimed = claimedRewards.includes(tier.level);
           const progress = Math.min((currentSignups / tier.target) * 100, 100);
           
           return (
             <div key={tier.level} className={`tier-card ${isUnlocked ? 'unlocked' : 'locked'} ${isClaimed ? 'claimed' : ''}`}>
               <div className="tier-icon">{tier.emoji}</div>
               <h3>{tier.title}</h3>
               <p>{tier.desc}</p>
               
               <div className="tier-footer">
                 <div className="target-badge">Goal: {tier.target} Users</div>
                 {!isUnlocked && (
                   <div className="tier-progress-bar">
                      <div className="tier-fill" style={{ width: `${progress}%` }}></div>
                   </div>
                 )}
                 {isUnlocked && !isClaimed && (
                   <button className="claim-btn" onClick={() => handleClaim(tier)}>
                     Claim Reward 🎉
                   </button>
                 )}
                 {isClaimed && <button className="claim-btn claimed-btn" disabled>Claimed ✅</button>}
               </div>
               
               {isUnlocked && !isClaimed && <div className="unlocked-overlay">UNLOCKED</div>}
               {isClaimed && <div className="unlocked-overlay claimed-overlay">COMPLETED</div>}
             </div>
           );
         })}
      </div>
    </div>
  );
};

export default Rewards;
