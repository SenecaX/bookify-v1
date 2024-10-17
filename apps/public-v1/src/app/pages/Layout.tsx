import React from 'react';
import { Container, Box } from '@mui/material';
import Navbar from './Navbar'; // Assuming Navbar is already a separate component
import HeroSection from './HeroSection'; // We'll extract the hero section as well

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* Navbar should always appear on top */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
