
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Gift, Star, Users, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RaffleWidget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleJoinRaffle = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join the raffle.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Raffle Entry Successful!",
      description: "You've been entered into the raffle. Good luck!"
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-40 animate-slide-in-right">
      <div className="bg-gradient-to-br from-purple-600/90 to-blue-600/90 backdrop-blur-sm border border-purple-500/50 rounded-2xl p-6 max-w-sm shadow-2xl">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 p-1 text-white/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Gift size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Daily Raffle</h3>
            <p className="text-white/80 text-sm">Win exclusive NFTs!</p>
          </div>
        </div>

        <div className="bg-black/20 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Time Remaining</span>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star size={14} />
              <span className="text-xs">Featured</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-white">
            <div className="bg-white/20 rounded-lg px-2 py-1 text-center min-w-[3rem]">
              <div className="text-lg font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="text-xs opacity-80">HRS</div>
            </div>
            <span className="text-white/60">:</span>
            <div className="bg-white/20 rounded-lg px-2 py-1 text-center min-w-[3rem]">
              <div className="text-lg font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="text-xs opacity-80">MIN</div>
            </div>
            <span className="text-white/60">:</span>
            <div className="bg-white/20 rounded-lg px-2 py-1 text-center min-w-[3rem]">
              <div className="text-lg font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="text-xs opacity-80">SEC</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-white/80">
            <Users size={16} />
            <span className="text-sm">1,247 entries</span>
          </div>
          <div className="text-white text-sm">
            Prize: <span className="font-bold text-yellow-400">5 ETH</span>
          </div>
        </div>

        <button
          onClick={handleJoinRaffle}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105"
        >
          Join Raffle - Free Entry!
        </button>

        <p className="text-white/60 text-xs text-center mt-2">
          One entry per account • Draw at midnight UTC
        </p>
      </div>
    </div>
  );
};

export default RaffleWidget;
