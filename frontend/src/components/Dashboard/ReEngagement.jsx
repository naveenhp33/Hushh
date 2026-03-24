import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ReEngagement = () => {
  useEffect(() => {
    // In a real app, this would be triggered by a backend check or a service worker.
    // For this dashboard, we'll simulate a "Welcome Back" or "Inactivity Reminder" 
    // after a short delay if it's the first time they've landed here.
    
    const timer = setTimeout(() => {
      const messages = [
        "👋 You're close to your next referral goal! Share your link now.",
        "💡 Tip: Top Hush AI ambassadors post their links on LinkedIn for 3x more clicks.",
        "🎯 Don't forget to complete your Day 3 task for a bonus badge!"
      ];
      
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      toast(randomMsg, {
        icon: '🔔',
        duration: 5000,
        style: {
          borderRadius: '10px',
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        },
      });
    }, 15000); // Show notification after 15 seconds of inactivity/exploration

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default ReEngagement;
