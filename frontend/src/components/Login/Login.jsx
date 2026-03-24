import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from '../../api/axios';
import './Login.css';

const Login = () => {
  const { loginWithGoogle, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mode, setMode] = useState('login'); // 'login', 'signup', or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    try {
      let user;
      if (mode === 'admin') {
        user = await adminLogin(email, password);
      } else {
        user = await loginWithGoogle();
        // Track ambassador login
        await axios.post('/analytics/track', {
          uid: user.firebaseUid,
          event: mode,
          step: 'button_click'
        });
      }

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.onboardingComplete) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      const msg = mode === 'admin' ? "Invalid admin credentials" : `${mode === 'login' ? 'Login' : 'Signup'} failed.`;
      toast.error(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-header">
           <h1>Hush AI 🚀</h1>
           <p className="subtitle">
             {mode === 'login' && 'Welcome Back!'}
             {mode === 'signup' && 'Join the Program'}
             {mode === 'admin' && 'Central Command'}
           </p>
        </div>

        <div className="tabs">
          <button className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
          <button className={`tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign Up</button>
          <button className={`tab ${mode === 'admin' ? 'active' : ''}`} onClick={() => setMode('admin')}>Admin</button>
        </div>
        
        <p className="description">
          {mode === 'login' && 'Sign in to access your dashboard'}
          {mode === 'signup' && 'Join our campus ambassador network and promote Hush AI'}
          {mode === 'admin' && 'Developer/Admin login for program management'}
        </p>

        {mode === 'admin' ? (
          <form className="admin-form" onSubmit={handleLogin}>
            <div className="input-group">
              <input 
                type="email" 
                placeholder="Admin Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isLoggingIn} className="login-submit-btn">
              {isLoggingIn ? "Authenticating..." : "Login to Command"}
            </button>
          </form>
        ) : (
          <button 
            onClick={handleLogin} 
            disabled={isLoggingIn}
            className="google-btn"
          >
            {isLoggingIn ? "Processing..." : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" />
                {mode === 'login' && 'Sign in with Google'}
                {mode === 'signup' && 'Sign up with Google'}
              </>
            )}
          </button>
        )}
        
        <div className="features-hint">
            <span>✨ Refer & Earn</span>
            <span>📊 Live Stats</span>
            <span>🏆 Leaderboard</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
