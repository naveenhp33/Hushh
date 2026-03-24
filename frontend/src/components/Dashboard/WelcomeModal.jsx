import React, { useState, useEffect } from 'react';
import './WelcomeModal.css';

const WelcomeModal = ({ user }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the welcome message has already been shown this session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    
    if (!hasSeenWelcome && user) {
      setIsVisible(true);
      // Ensure it doesn't show again until they restart their browser/session
      sessionStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [user]);

  if (!isVisible || !user) return null;

  // Determine if user is "new" (created within the last 5 minutes, i.e., just signed up & onboarded)
  const isNewUser = user.createdAt 
    ? (Date.now() - new Date(user.createdAt).getTime()) < 5 * 60 * 1000 
    : false;

  return (
    <div className="welcome-modal-overlay">
      <div className="welcome-modal-content">
        <button className="close-modal-btn" onClick={() => setIsVisible(false)}>×</button>
        
        <div className="welcome-icon">
          {isNewUser ? '🎉' : '👋'}
        </div>
        
        <h2 className="welcome-title">
          {isNewUser ? 'Welcome Aboard,' : 'Welcome Back,'} <br/> 
          <span className="welcome-name">{user.name}!</span>
        </h2>
        
        <p className="welcome-message">
          {isNewUser 
            ? "We are thrilled to officially welcome you to the Hush AI Ambassador program. Your personalized dashboard is ready. Let's start growing your network and unlocking premium rewards!" 
            : "Your Central Command is ready. Check out the leaderboard, grab your latest referral stats, and keep pushing for the next tier!"}
        </p>

        <button className="welcome-action-btn" onClick={() => setIsVisible(false)}>
          {isNewUser ? "Let's Go! 🚀" : "Go to Dashboard ➔"}
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
