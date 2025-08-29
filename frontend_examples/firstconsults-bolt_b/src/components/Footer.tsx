import React from 'react';
import { Building, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-2xl shadow-lg">
                <Building className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                FirstConsults
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              Empowering businesses through strategic consulting and innovative solutions that drive sustainable growth and success.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300 hover:text-orange-300 transition-colors duration-300 group cursor-pointer">
                <div className="bg-red-500/20 p-2 rounded-lg group-hover:bg-red-500/30 transition-colors duration-300">
                  <Mail size={18} />
                </div>
                <span className="text-lg">hello@firstconsults.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-orange-300 transition-colors duration-300 group cursor-pointer">
                <div className="bg-red-500/20 p-2 rounded-lg group-hover:bg-red-500/30 transition-colors duration-300">
                  <Phone size={18} />
                </div>
                <span className="text-lg">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-orange-300 transition-colors duration-300 group cursor-pointer">
                <div className="bg-red-500/20 p-2 rounded-lg group-hover:bg-red-500/30 transition-colors duration-300">
                  <MapPin size={18} />
                </div>
                <span className="text-lg">New York, NY</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <div className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Careers', 'Blog'].map((link) => (
                <div key={link} className="text-gray-300 hover:text-orange-300 transition-colors duration-300 cursor-pointer text-lg hover:translate-x-1 transform transition-transform">
                  {link}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-red-500/30 relative z-10">
          <p className="text-center text-gray-400 text-lg">
            © 2025 FirstConsults. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;