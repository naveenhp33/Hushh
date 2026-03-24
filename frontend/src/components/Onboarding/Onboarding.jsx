import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import './Onboarding.css';

const Onboarding = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    college: '',
    interests: []
  });

  const availableInterests = ['Marketing', 'Tech', 'Design', 'Sales', 'Content Creation'];

  useEffect(() => {
    // Track onboarding entry
    axios.post('/analytics/track', {
      uid: user?.firebaseUid,
      event: 'onboarding',
      step: 'start'
    });
  }, [user]);

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleComplete = async () => {
    if (!formData.college) {
      return toast.error("Please enter your college name");
    }
    
    try {
      const { data } = await axios.post('/auth/onboarding', {
        uid: user.firebaseUid,
        college: formData.college,
        interests: formData.interests
      });
      setUser(data.user);
      toast.success("Welcome aboard!");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Onboarding failed. Try again.");
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(step / 2) * 100}%` }}></div>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <h2>Where are you studying? 🏛️</h2>
            <p>Tell us your college name to get started.</p>
            <input 
              type="text" 
              placeholder="e.g. Stanford University"
              value={formData.college}
              onChange={(e) => setFormData({...formData, college: e.target.value})}
              autoFocus
            />
            <button className="primary-btn" onClick={() => setStep(2)}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h2>What are you into? ✨</h2>
            <p>Select your interests (min 1).</p>
            <div className="interests-grid">
              {availableInterests.map(interest => (
                <div 
                  key={interest}
                  className={`interest-tag ${formData.interests.includes(interest) ? 'active' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </div>
              ))}
            </div>
            <div className="button-group">
                <button className="secondary-btn" onClick={() => setStep(1)}>Back</button>
                <button className="primary-btn" onClick={handleComplete}>Complete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
