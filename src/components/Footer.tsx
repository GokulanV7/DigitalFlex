
import React from 'react';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Evaltree
              </span>
            </div>
            <p className="text-slate-400 max-w-md mb-6">
              The premier platform for issuing and collecting digital assets. 
              Create, trade, and own unique digital collectibles with blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <div className="space-y-2">
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Marketplace</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Create Collection</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Raffles</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Analytics</a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Help Center</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Community</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-12 pt-8 text-center">
          <p className="text-slate-400">
            © 2024 Evaltree. All rights reserved. Built for Alatree Ventures internship showcase.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
