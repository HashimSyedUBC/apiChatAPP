import React from 'react';
import document1 from './document1.png';
import document2 from './document2.png';
import document3 from './document3.png';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h2 className="hero-subtitle">
            Company tailored <span className="highlightHero">Co-pilot</span> for all your documentation.
          </h2>
        </div>
        <div className="hero-images">
          <img src={document2} alt="Documentation 1" className="image-1" />
          <img src={document1} alt="Documentation 2" className="image-2" />
          <img src={document3} alt="Documentation 3" className="image-3" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;