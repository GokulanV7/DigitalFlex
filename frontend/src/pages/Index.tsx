
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParallaxHero from '../components/ParallaxHero';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Star } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Hero Section with Parallax */}
      <ParallaxHero />
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-20 space-y-20">
        {/* Quick Actions for Authenticated Users */}
        {user && (
          <section className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-3xl p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome back, <span className="text-purple-400">{user.user_metadata?.full_name || 'Collector'}</span>!
              </h2>
              <p className="text-slate-400">What would you like to do today?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/create')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 p-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <Zap size={32} className="text-white mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">Create Collectible</h3>
                  <p className="text-purple-100 text-sm">Issue your digital asset</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/marketplace')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 p-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <Shield size={32} className="text-white mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">Browse Marketplace</h3>
                  <p className="text-green-100 text-sm">Discover collectibles</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 p-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <Star size={32} className="text-white mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">View Dashboard</h3>
                  <p className="text-yellow-100 text-sm">Manage your collection</p>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Call to Action for Non-authenticated Users */}
        {!user && (
          <section className="text-center">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Start Your
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Digital Journey?</span>
              </h2>
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                Join thousands of creators and collectors in the premier digital collectibles ecosystem. 
                Create, trade, and own unique digital assets with blockchain security.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center mx-auto">
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>Get Started Now</span>
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/create')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>Start Creating</span>
                  <Zap size={20} />
                </button>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>Explore Market</span>
                  <Shield size={20} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Evaltree?</h2>
            <p className="text-xl text-slate-400">Experience the future of digital ownership</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Instant Creation</h3>
              <p className="text-slate-400">Create and issue collectibles in minutes with our streamlined platform.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Secure Transactions</h3>
              <p className="text-slate-400">Bank-grade security with Stripe payments and blockchain verification.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Exclusive Raffles</h3>
              <p className="text-slate-400">Participate in premium raffles and win rare digital collectibles.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
