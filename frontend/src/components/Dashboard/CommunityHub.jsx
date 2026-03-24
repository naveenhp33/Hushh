import React, { useState, useEffect } from 'react';
import './CommunityHub.css';

const CommunityHub = () => {
  const [feed, setFeed] = useState([
    { id: 1, type: 'milestone', user: 'Aarav S.', message: 'just unlocked the Swag Box! 🎁', time: '2 mins ago', icon: '🔥' },
    { id: 2, type: 'signup', user: 'Zoe M.', message: 'recruited a new Hush AI user.', time: '15 mins ago', icon: '📈' },
    { id: 3, type: 'announcement', user: 'Admin', message: 'Double points this weekend! Share your links now. 🚀', time: '1 hr ago', icon: '📢' },
    { id: 4, type: 'milestone', user: 'Noah K.', message: 'reached Tier 1 (Premium).', time: '2 hrs ago', icon: '⭐' },
    { id: 5, type: 'signup', user: 'Liam P.', message: 'recruited a new Hush AI user.', time: '5 hrs ago', icon: '📈' },
  ]);

  return (
    <div className="community-page">
      <header className="page-header">
         <h1>Community Hub 🌍</h1>
         <p>Connect with other top-tier Hush AI ambassadors.</p>
      </header>

      <div className="community-grid">
        <div className="main-column">
           <div className="live-feed-panel">
              <div className="panel-header">
                 <h3>Live Activity Feed</h3>
                 <span className="live-indicator">● LIVE</span>
              </div>
              
              <div className="feed-list">
                 {feed.map((item) => (
                   <div key={item.id} className={`feed-item ${item.type}`}>
                      <div className="feed-icon">{item.icon}</div>
                      <div className="feed-content">
                         <span className="feed-user">{item.user}</span>
                         <span className="feed-message"> {item.message}</span>
                      </div>
                      <div className="feed-time">{item.time}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="side-column">
           <div className="social-links-panel">
              <h3>Join the Conversation</h3>
              <p>Get exclusive tips, hang out with the team, and share your wins.</p>
              
              <div className="social-buttons">
                 <button className="social-btn discord-btn">
                    <span>🎮</span> Join our Discord
                 </button>
                 <button className="social-btn whatsapp-btn">
                    <span>💬</span> Ambassador WhatsApp
                 </button>
                 <button className="social-btn linkedin-btn">
                    <span>💼</span> Follow on LinkedIn
                 </button>
              </div>
           </div>

           <div className="announcement-panel">
              <h3>📌 Pinned Announcement</h3>
              <div className="pinned-card">
                 <h4>Summer Internship Program</h4>
                 <p>Applications for the paid summer engineering internship open next month! Top 10 ambassadors get a guaranteed interview.</p>
                 <button className="read-more-btn">Read Details ➔</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
