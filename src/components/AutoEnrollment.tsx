
import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Star, Gift, CheckCircle } from 'lucide-react';

const AutoEnrollment = () => {
  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'enrolling' | 'enrolled'>('idle');
  const [userProfile, setUserProfile] = useState({
    id: '',
    tier: 'Bronze',
    perks: [] as string[],
    joinDate: ''
  });

  const membershipTiers = [
    {
      name: 'Bronze',
      icon: '🥉',
      color: 'from-yellow-600 to-yellow-700',
      perks: ['Basic marketplace access', 'Standard support', 'Monthly newsletter']
    },
    {
      name: 'Silver',
      icon: '🥈',
      color: 'from-gray-400 to-gray-500',
      perks: ['Priority listings', '5% fee reduction', 'Beta feature access', 'Discord VIP channel']
    },
    {
      name: 'Gold',
      icon: '🥇',
      color: 'from-yellow-400 to-yellow-500',
      perks: ['Featured collections', '10% fee reduction', 'Private sales', 'Personal curator', 'Exclusive events']
    },
    {
      name: 'Platinum',
      icon: '💎',
      color: 'from-purple-400 to-purple-500',
      perks: ['Zero fees', 'Custom smart contracts', 'White-glove service', 'Investment opportunities', 'Annual retreat invitation']
    }
  ];

  const simulateEnrollment = () => {
    setEnrollmentStatus('enrolling');
    
    setTimeout(() => {
      const newProfile = {
        id: `USER_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        tier: 'Bronze',
        perks: membershipTiers[0].perks,
        joinDate: new Date().toLocaleDateString()
      };
      
      setUserProfile(newProfile);
      setEnrollmentStatus('enrolled');
    }, 2500);
  };

  if (enrollmentStatus === 'enrolled') {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">Welcome to Evaltree!</h3>
          <p className="text-slate-400">You've been automatically enrolled in our premium platform.</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <UserPlus size={24} className="text-white" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Member Profile</h4>
              <p className="text-slate-400">ID: {userProfile.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <span className="text-slate-400 text-sm">Member Since</span>
              <div className="text-white font-semibold">{userProfile.joinDate}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <span className="text-slate-400 text-sm">Current Tier</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🥉</span>
                <span className="text-white font-semibold">{userProfile.tier}</span>
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <span className="text-slate-400 text-sm">Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Tier Benefits */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 border border-yellow-600/30 rounded-xl p-6 mb-6">
          <h4 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
            <Star size={20} className="text-yellow-400" />
            <span>Bronze Tier Benefits</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {userProfile.perks.map((perk, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-slate-300 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Path */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6">
          <h4 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
            <Gift size={20} className="text-purple-400" />
            <span>Upgrade Your Membership</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {membershipTiers.slice(1, 4).map((tier, index) => (
              <div key={tier.name} className="bg-slate-700/30 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">{tier.icon}</div>
                <h5 className="text-white font-semibold mb-2">{tier.name}</h5>
                <p className="text-slate-400 text-xs mb-3">{tier.perks.length} exclusive benefits</p>
                <button className={`w-full bg-gradient-to-r ${tier.color} text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity`}>
                  Upgrade to {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (enrollmentStatus === 'enrolling') {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-white mb-3">Setting Up Your Account</h3>
          <p className="text-slate-400 mb-6">
            We're automatically enrolling you into the Evaltree platform with exclusive benefits.
          </p>
          
          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="space-y-3">
              {['Creating your profile...', 'Assigning membership tier...', 'Activating benefits...'].map((step, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-slate-300">{step}</span>
                  <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus size={40} className="text-purple-400" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-2">Join Evaltree Platform</h3>
        <p className="text-slate-400">
          Get automatic enrollment with exclusive membership benefits when you create or purchase collectibles.
        </p>
      </div>

      {/* Membership Tiers Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {membershipTiers.map((tier, index) => (
          <div key={tier.name} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">{tier.icon}</div>
            <h4 className="text-white font-semibold text-lg">{tier.name}</h4>
            <p className="text-slate-400 text-sm">{tier.perks.length} benefits</p>
          </div>
        ))}
      </div>

      {/* Benefits Preview */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 mb-8">
        <h4 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
          <Shield size={20} className="text-blue-400" />
          <span>Automatic Enrollment Benefits</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-slate-300">Instant platform access</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-slate-300">Bronze tier membership</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-slate-300">Raffle participation</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-slate-300">Portfolio tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-slate-300">Community access</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-slate-300">Upgrade opportunities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Trigger */}
      <button
        onClick={simulateEnrollment}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
      >
        <UserPlus size={20} />
        <span>Start Auto-Enrollment Process</span>
      </button>

      <p className="text-slate-500 text-xs text-center mt-4">
        * Enrollment occurs automatically when you create or purchase your first collectible
      </p>
    </div>
  );
};

export default AutoEnrollment;
