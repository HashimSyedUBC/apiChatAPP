import React from 'react';
import { MessageCircle } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="logo">
            <MessageCircle size={20} className="logo-icon" />
            <span className="company-name">APAI</span>
          </div>
          <p className="copyright">&copy; {currentYear} APAI. All rights reserved.</p>
        </div>
        <div className="footer-right">
          <a href="#contact" className="contact-link">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;