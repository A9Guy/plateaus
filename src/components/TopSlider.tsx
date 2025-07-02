import React from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const TopSlider = () => {
  const slides = [
    {
      id: 1,
      title: "Free Shipping on Orders Over ₦50,000",
      subtitle: "Shop now and save on delivery",
      bgColor: "bg-primary"
    },
    {
      id: 2,
      title: "New Sellers Welcome - Start Selling Today",
      subtitle: "Join thousands of successful merchants",
      bgColor: "bg-blue-600"
    },
    {
      id: 3,
      title: "24/7 Customer Support Available",
      subtitle: "We're here to help you anytime",
      bgColor: "bg-green-600"
    }
  ];

  return (
    <div className="bg-primary text-primary-foreground py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-2"
                >
                  <div className="text-sm font-medium">{slide.title}</div>
                  <div className="text-xs opacity-90">{slide.subtitle}</div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 h-6 w-6 border-primary-foreground/20" />
          <CarouselNext className="right-0 h-6 w-6 border-primary-foreground/20" />
        </Carousel>
      </div>
    </div>
  );
};

export default TopSlider;