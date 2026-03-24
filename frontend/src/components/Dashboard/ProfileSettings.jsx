import React, { useState } from 'react';
import './ProfileSettings.css';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from '../../api/axios';

const ProfileSettings = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    phone: '',
    paymentId: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/dashboard/profile/${user.firebaseUid}`, formData);
      toast.success('Profile updated successfully! 🚀');
      if (refreshUser) await refreshUser();
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <header className="page-header">
         <h1>Profile & Settings ⚙️</h1>
         <p>Manage your account details and payout preferences.</p>
      </header>

      <div className="settings-content">
        <div className="profile-card">
           <div className="profile-avatar-large">
              <img src={user?.photoURL || 'https://via.placeholder.com/100'} alt="Profile" />
              <button className="change-photo-btn">Change Photo</button>
           </div>
           
           <div className="profile-stats-mini">
              <div className="stat">
                 <span className="value">Role</span>
                 <span className="label">Ambassador</span>
              </div>
              <div className="stat">
                 <span className="value">Joined</span>
                 <span className="label">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
           </div>
        </div>

        <form className="settings-form" onSubmit={handleSave}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-row">
              <div className="input-group">
                <label>Email (Read Only)</label>
                <input type="email" value={user?.email || ''} readOnly className="readonly-input" />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" placeholder="+1..." value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <label>University / College</label>
              <input type="text" name="college" value={formData.college} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-section">
            <h3>Reward Payouts</h3>
            <p className="section-desc">If your program offers cash incentives, link your payment method here.</p>
            <div className="input-group">
              <label>PayPal Email or UPI ID</label>
              <input type="text" name="paymentId" placeholder="e.g., student@paypal.com" value={formData.paymentId} onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
             <button type="submit" disabled={loading} className="save-btn">
               {loading ? 'Saving Changes...' : 'Save Profile 💾'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
