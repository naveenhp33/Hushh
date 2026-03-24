import React, { useState } from 'react';
import './MarketingToolkit.css';
import { toast } from 'react-hot-toast';

const MarketingToolkit = () => {
  const [activeTab, setActiveTab] = useState('templates');

  const templates = [
    {
      platform: 'WhatsApp 📱',
      text: 'Hey guys! 👋 I just started using Hush AI and it\'s insane for organizing notes and projects. You can get early access using my VIP link here: [LINK] 🚀',
    },
    {
      platform: 'LinkedIn 💼',
      text: 'I\'m excited to share that I\'ve joined Hush AI as a Campus Ambassador for my university! 🎓\n\nIf anyone is looking for a next-gen AI productivity tool to streamline their coursework, check it out here: [LINK]\n\n#HushAI #Productivity #StudentLife',
    },
    {
      platform: 'Twitter / X 🐦',
      text: 'Just joined the @HushAI_HQ ambassador program! If you want to stop wasting time on manual note-taking, grab early access through my link 👇 [LINK]',
    }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Template copied to clipboard!');
  };

  return (
    <div className="toolkit-page">
      <header className="page-header">
         <h1>Marketing Toolkit 🧰</h1>
         <p>Everything you need to successfully promote Hush AI and get clicks.</p>
      </header>

      <div className="toolkit-nav">
        <button className={activeTab === 'templates' ? 'active' : ''} onClick={() => setActiveTab('templates')}>📝 Copy Templates</button>
        <button className={activeTab === 'graphics' ? 'active' : ''} onClick={() => setActiveTab('graphics')}>🎨 Download Assets</button>
        <button className={activeTab === 'guide' ? 'active' : ''} onClick={() => setActiveTab('guide')}>📘 Best Practices</button>
      </div>

      <div className="toolkit-content">
        {activeTab === 'templates' && (
          <div className="templates-section">
            <h3>Plug & Play Templates</h3>
            <p className="subtitle">Just copy, replace [LINK] with your referral code, and post!</p>
            
            <div className="templates-grid">
               {templates.map((tpl, idx) => (
                 <div key={idx} className="template-card">
                   <div className="template-header">
                      <span>{tpl.platform}</span>
                   </div>
                   <div className="template-body">
                      <p>{tpl.text}</p>
                   </div>
                   <button onClick={() => handleCopy(tpl.text)} className="copy-btn">
                     Copy Text 📋
                   </button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'graphics' && (
          <div className="graphics-section">
            <h3>Official Brand Assets</h3>
            <div className="graphics-grid">
               <div className="graphic-card">
                 <div className="graphic-preview logo-preview">
                    <h1>Hush AI</h1>
                 </div>
                 <button className="download-btn">Download Logo Kit</button>
               </div>
               <div className="graphic-card">
                 <div className="graphic-preview banner-preview">
                    <span>Campus Ambassador</span>
                 </div>
                 <button className="download-btn">Download Social Banners</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="guide-section">
            <h3>How to get your first 100 clicks</h3>
            <ul className="guide-list">
              <li>
                <strong>1. Start Local:</strong> Post your link in your class WhatsApp or Discord groups right before midterms.
              </li>
              <li>
                <strong>2. Tell a Story:</strong> Don't just spam the link. Tell people *how* Hush AI saved you time on a specific assignment.
              </li>
              <li>
                <strong>3. LinkedIn Leverage:</strong> Add "Campus Ambassador at Hush AI" to your LinkedIn profile. It builds credibility and generates organic clicks.
              </li>
              <li>
                <strong>4. The Link-in-Bio:</strong> Add your referral link to your Instagram and Twitter bios.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingToolkit;
