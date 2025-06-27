
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img 
              src="/lovable-uploads/79bae75a-1e2d-4cdb-b7a1-32c8c5106ee4.png" 
              alt="PLATEAUS Ltd" 
              className="h-12 w-auto mb-4 bg-white p-2 rounded"
            />
            <p className="text-gray-300 mb-4">
              Your premier marketplace for quality products from trusted sellers across Nigeria.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Return Policy</a></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h4 className="font-semibold text-lg mb-4">For Sellers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Become a Seller</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Seller Dashboard</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Seller Guidelines</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Fees & Charges</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">+234 800 000 0000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">support@plateaus.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <span className="text-gray-300">
                  Lagos, Nigeria<br />
                  Serving nationwide
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 PLATEAUS Ltd. All rights reserved. | Powered by Quality
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
