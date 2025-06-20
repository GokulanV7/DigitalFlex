
import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

const ParallaxHero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div 
          className="absolute top-40 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"
          style={{ transform: `translateX(-50%) translateY(${scrollY * 0.1}px)` }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div 
            className="space-y-8"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2">
              <Sparkles size={16} className="text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Next-Gen Digital Collectibles</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Create & Collect
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Digital Assets
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
              Join the premier platform for issuing, trading, and collecting unique digital assets. 
              Experience the future of ownership with blockchain-powered collectibles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                <span>Start Creating</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="flex items-center justify-center space-x-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:bg-slate-700/50 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                <TrendingUp size={20} />
                <span>Explore Market</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-slate-400 text-sm">Collections</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500K+</div>
                <div className="text-slate-400 text-sm">Assets Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">$2M+</div>
                <div className="text-slate-400 text-sm">Volume Traded</div>
              </div>
            </div>
          </div>

          {/* Floating Collectible Cards */}
          <div 
            className="relative"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Card 1 */}
              <div 
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transform rotate-3 hover:rotate-0 transition-all duration-500"
                style={{ transform: `rotate(3deg) translateY(${scrollY * 0.05}px)` }}
              >
                <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4"></div>
                <h3 className="text-white font-semibold">Golden Edition</h3>
                <p className="text-slate-400 text-sm">Limited Collection</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-purple-400 font-bold">2.5 ETH</span>
                  <span className="text-xs text-slate-500">#001/100</span>
                </div>
              </div>

              {/* Card 2 */}
              <div 
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transform -rotate-2 hover:rotate-0 transition-all duration-500 mt-8"
                style={{ transform: `rotate(-2deg) translateY(${scrollY * 0.08}px)` }}
              >
                <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4"></div>
                <h3 className="text-white font-semibold">Cyber Genesis</h3>
                <p className="text-slate-400 text-sm">Rare Drop</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-blue-400 font-bold">1.8 ETH</span>
                  <span className="text-xs text-slate-500">#005/50</span>
                </div>
              </div>

              {/* Card 3 */}
              <div 
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transform rotate-1 hover:rotate-0 transition-all duration-500 -mt-4"
                style={{ transform: `rotate(1deg) translateY(${scrollY * 0.03}px)` }}
              >
                <div className="w-full h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mb-4"></div>
                <h3 className="text-white font-semibold">Nature's Call</h3>
                <p className="text-slate-400 text-sm">Eco Series</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-green-400 font-bold">0.9 ETH</span>
                  <span className="text-xs text-slate-500">#012/200</span>
                </div>
              </div>

              {/* Card 4 */}
              <div 
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transform -rotate-1 hover:rotate-0 transition-all duration-500"
                style={{ transform: `rotate(-1deg) translateY(${scrollY * 0.06}px)` }}
              >
                <div className="w-full h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mb-4"></div>
                <h3 className="text-white font-semibold">Fire Element</h3>
                <p className="text-slate-400 text-sm">Elemental Set</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-orange-400 font-bold">3.2 ETH</span>
                  <span className="text-xs text-slate-500">#003/25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxHero;
