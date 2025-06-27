
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CategoriesGrid from '../components/CategoriesGrid';
import FlashSales from '../components/FlashSales';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CategoriesGrid />
      <FlashSales />
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default Index;
