import React, { useEffect, useRef } from 'react';
import './fourthSection.css';

const DataDrivenEnhancement = () => {
  const timelineRef = useRef(null);

  const dataPoints = [
    {
      icon: 'chart-line',
      title: "Identify API Pain Points",
      description: "Analyze developer interactions to pinpoint areas for improvement"
    },
    {
      icon: 'file-alt',
      title: "Guide Documentation Improvements",
      description: "Uncover trending questions to enhance our knowledge base"
    },
    {
      icon: 'users',
      title: "Optimize Onboarding",
      description: "Gain insights into common API setup patterns for smoother starts"
    },
    {
      icon: 'sync-alt',
      title: "Refine AI Responses",
      description: "Continuously improve accuracy based on user feedback"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="enhancement-section">
      <div className="container">
        <h2 className="section-title">
          Data-Driven Product <span className="highlight">Enhancement</span>
        </h2>
        <p className="section-description">
          Leverage user insights and behavior patterns to continuously improve our product and deliver an unparalleled experience.
        </p>
        <div className="timeline" ref={timelineRef}>
          {dataPoints.map((point, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-icon">
                <i className={`fas fa-${point.icon}`}></i>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-title">{point.title}</h3>
                <p className="timeline-description">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataDrivenEnhancement;