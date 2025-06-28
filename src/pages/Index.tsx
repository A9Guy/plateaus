
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CategoriesGrid from '../components/CategoriesGrid';
import FlashSales from '../components/FlashSales';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <Header />
      <HeroSection />
      <CategoriesGrid />
      <FlashSales />
      <FeaturedProducts />
      <Footer />
      <PWAInstallPrompt />
    </motion.div>
  );
};

export default Index;
