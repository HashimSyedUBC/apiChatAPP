import React from 'react';
import phone from './phone.png';
import tablet from './tablet.png';
import desktop from './desktop.png';
import { Zap, LightbulbIcon, Code, Puzzle } from 'lucide-react';
import './ContextualAwarenessSection.css';

const ContextualAwarenessSection = () => {
  return (
    <section className="contextual-awareness-sectionContext">
      <div className="contentContext">
        <div className="image-contentContext">
          <img src={phone} alt="Placeholder 1" className="imageContext image-1Context" />
          <img src={tablet} alt="Placeholder 2" className="imageContext image-2Context" />
          <img src={desktop} alt="Placeholder 3" className="imageContext image-3Context" />
        </div>
        <div className="text-contentContext">
          <h2 className="titleContext">
            Speedy Context-rich responses for <span className="highlightContext">your</span> clients
          </h2>
          <div className="subtitle-containerContext">
            <Zap className="iconContext" size={48} fill="#00ff88" color="#00ff88" />
            <p className="subtitleContext">
              Set your API apart and boost customer retention by providing <strong>instant, on-the-go support</strong>, ensuring clients get quick answers to all their API-related questions.
            </p>
          </div>
          <div className="subtitle-containerContext">
            <LightbulbIcon className="iconContext" size={48} stroke="#00ff88" strokeWidth={2} />
            <p className="subtitleContext">
              Equip decision-makers with <strong>clear, high-level insights</strong> into your API's benefits, helping them understand the value and competitive advantages without diving into technical details.
            </p>
          </div>
          <div className="subtitle-containerContext">
            <Code className="iconContext" size={48} stroke="#00ff88" strokeWidth={2} />
            <p className="subtitleContext">
              Our AI precisely extracts and synthesizes information across multiple endpoints and workflows, delivering <strong>accurate, language-specific code snippets</strong> on demand.
            </p>
          </div>
          <div className="subtitle-containerContext">
            <Puzzle className="iconContext" size={48} stroke="#00ff88" strokeWidth={2} />
            <p className="subtitleContext">
              We <strong>streamline the development process</strong> by effortlessly piecing together complex service integrations, saving developers countless hours and accelerating customer implementation timelines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContextualAwarenessSection;