import React from 'react';
import { MessageCircle } from 'lucide-react';
import './Header.css';

const Header = () => {
  const scrollToForm = (event) => {
    event.preventDefault();
    const formElement = document.getElementById('company-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <MessageCircle size={28} className="logo-icon" />
          <span className="company-name">APAI</span>
        </div>
        <a href="#company-form" className="contact-button" onClick={scrollToForm}>Contact</a>
      </div>
    </header>
  );
};

export default Header;