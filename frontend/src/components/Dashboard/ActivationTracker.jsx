import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './Dashboard.css';

const ActivationTracker = () => {
  const { user, refreshUser } = useAuth();
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    if (user?.activationTasks) {
       setTasks(user.activationTasks);
    }
  }, [user]);

  const toggleTask = async (taskName) => {
    try {
      const { data } = await axios.post(`/dashboard/activation/${user.firebaseUid}/task`, { task: taskName });
      setTasks(data.tasks);
      refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  const checklistItems = [
    { id: 'profileComplete', day: 'Day 1', label: 'Complete your profile', desc: 'Add your college and interests during onboarding.' },
    { id: 'sharedReferral', day: 'Day 2', label: 'Share your referral link', desc: 'Post your link on at least one social platform.' },
    { id: 'firstSignup', day: 'Day 3', label: 'Get your first signup', desc: 'Secure your first successful referral signup.' },
    { id: 'engagedWeek', day: 'Day 7', label: 'Weekly consistent activity', desc: 'Interact with the dashboard for 7 days.' },
    { id: 'reachedTop10', day: 'Milestone', label: 'Enter the Top 10', desc: 'Reach the leaderboard top 10 rankings.' },
  ];

  const completedCount = Object.values(tasks).filter(Boolean).length;
  const progressPercent = (completedCount / checklistItems.length) * 100;

  return (
    <div className="activation-tracker">
      <header className="page-header">
         <h1>7-Day Activation ⚡</h1>
         <p>Complete these tasks to become a verified star Hush AI ambassador.</p>
      </header>

      <div className="progress-summary">
         <div className="progress-labels">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercent)}% Complete</span>
         </div>
         <div className="progress-bar-large">
            <div className="progress-inner" style={{ width: `${progressPercent}%` }}></div>
         </div>
      </div>

      <div className="tasks-list">
         {checklistItems.map(item => (
            <div key={item.id} className={`task-item ${tasks[item.id] ? 'completed' : ''}`}>
               <div className="task-status">
                  <input 
                    type="checkbox" 
                    checked={!!tasks[item.id]} 
                    onChange={() => toggleTask(item.id)}
                  />
               </div>
               <div className="task-info">
                  <div className="task-meta">
                     <span className="task-day">{item.day}</span>
                     <h3>{item.label}</h3>
                  </div>
                  <p>{item.desc}</p>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default ActivationTracker;
