import React from 'react';
import './AboutHushAI.css';

const AboutHushAI = () => {
  return (
    <div className="about-page">
      <header className="page-header text-center">
         <h1>About Hush AI 🚀</h1>
         <p>Discover our core purpose and where we are heading.</p>
      </header>

      <div className="about-content">
         <div className="vision-mission-grid">
            <div className="vm-card">
               <div className="vm-icon">👁️</div>
               <h2>Our Vision</h2>
               <p>
                 To build a world where humans are free to focus on creativity and deep thinking, 
                 while intelligent, invisible AI handles the friction of daily productivity and data organization. 
                 We envision a future where Hush AI is the silent partner in every student and professional's success.
               </p>
            </div>

            <div className="vm-card">
               <div className="vm-icon">🎯</div>
               <h2>Our Mission</h2>
               <p>
                 Our mission is to democratize advanced AI tooling by building an accessible, 
                 lightning-fast platform that seamlessly integrates into existing workflows. 
                 By empowering our Campus Ambassadors, we aim to put Hush AI directly into the 
                 hands of the next generation of innovators.
               </p>
            </div>
         </div>

         <div className="core-values-section">
            <h3>Core Values</h3>
            <div className="values-grid">
               <div className="value-item">
                  <h4>💡 Innovation</h4>
                  <p>We believe in constantly pushing the boundaries of what AI can do for personal productivity.</p>
               </div>
               <div className="value-item">
                  <h4>🔒 Privacy</h4>
                  <p>Your data is yours. We build systems that respect user privacy at the foundational level.</p>
               </div>
               <div className="value-item">
                  <h4>🤝 Community</h4>
                  <p>Our tools are shaped by the people who use them. We grow together with our ambassadors.</p>
               </div>
               <div className="value-item">
                  <h4>⚡ Simplicity</h4>
                  <p>Powerful technology should not be complicated. We strive for elegant, frictionless design.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AboutHushAI;
