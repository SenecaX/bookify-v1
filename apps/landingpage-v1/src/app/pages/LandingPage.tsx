import React from 'react';
import { Container } from '@mui/material';
import FAQSection from '../components/landingpage/FAQSection';
import FeaturesSection from '../components/landingpage/FeaturesSection';
import Footer from '../components/landingpage/Footer';
import HeroSection from '../components/landingpage/HeroSection';
import HowItWorksSection from '../components/landingpage/HowItWorksSection';
import IndustriesSection from '../components/landingpage/IndustriesSection';
import IntegrationsSection from '../components/landingpage/IntegrationsSection';
import TestimonialsSection from '../components/landingpage/TestimonialsSection';
import Header from '../components/Header';


const LandingPage = () => {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <HeroSection />
        <FeaturesSection />
        <IndustriesSection />
        {/* <TestimonialsSection /> */}
        <HowItWorksSection />
        <IntegrationsSection />
        <FAQSection />
      </Container>
      <Footer />
    </>
  );
};

export default LandingPage;