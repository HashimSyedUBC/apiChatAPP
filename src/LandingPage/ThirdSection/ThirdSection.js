import React from 'react';
import { Zap, Puzzle, CreditCard } from 'lucide-react';
import './ThirdSection.css';

const FeatureCard = ({ Icon, title, points }) => (
  <div className="feature">
    <Icon className="featureIcon" />
    <h3>{title}</h3>
    <ul className="featurePoints">
      {points.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </div>
);

const SelfServeSupportSection = () => {
    const features = [
        {
          Icon: Zap,
          title: "Lightning-Fast Responses",
          points: [
            "Near-instant replies through advanced optimization",
            "Faster response times than human representatives",
            "Efficient and accurate answers with smart context retrieval"
          ]
        },
        {
          Icon: Puzzle,
          title: "Seamless Integration",
          points: [
            "Quick setup with our npm package and React component",
            "UI automatically adapts to your brand's unique style",
            "Effortless launch requiring only your API key and logo"
          ]
        },
        {
          Icon: CreditCard,
          title: "Usage-Based Pricing",
          points: [
            "Zero hidden fees and no upfront costs",
            "Straightforward pricing with a fixed rate per interaction",
            "Our success is directly tied to your satisfaction"
          ]
        }
    ];

  return (
    <div className="selfServeSupportSection">
      <div className="titleContainer">
        <h1 className="title">
          On-demand support that <span className="highlightThird">grows</span> with you
        </h1>
      </div>
      <div className="features">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default SelfServeSupportSection;