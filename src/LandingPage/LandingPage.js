import React from 'react';
import './LandingPage.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import HeroSection from './HeroSection/HeroSection';
import ContextualAwarenessSection from './SecondSection/SecondSections';
import SelfServeSupportSection from './ThirdSection/ThirdSection';
import DataDrivenEnhancementSection from './fourthSection/fourthSection';
import CompanyForm from './Form/form';


const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <main className="main-content">
        <HeroSection />

      <SelfServeSupportSection />
        <ContextualAwarenessSection />

      <DataDrivenEnhancementSection />
      <CompanyForm />
      </main>

      <Footer />

      <style jsx>{`
        .landing-page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          min-width: 100%;
          font-family: Arial, sans-serif;
        }

        .main-content {
          flex: 1 0 auto;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 2rem 0;
          padding-bottom: 0;
        }

        @media (min-width: 768px) {
          .main-content {
            padding: 4rem 0;
            padding-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
