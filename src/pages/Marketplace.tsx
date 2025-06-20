import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RaffleWidget from '@/components/RaffleWidget';
import CollectibleCard from '@/components/CollectibleCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Search, Filter, TrendingUp, Grid, List, Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Collectible {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  rarity: string;
  image_url?: string;
  user_id: string;
  created_at?: string;
}

const Marketplace = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [filteredCollectibles, setFilteredCollectibles] = useState<Collectible[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchCollectibles();
    // Check for payment success redirect
    const urlParams = new URLSearchParams(location.search);
    const paymentSuccess = urlParams.get('payment');
    const tradeSuccess = urlParams.get('trade');
    const itemName = urlParams.get('item');
    const tradeType = urlParams.get('type');

    if (paymentSuccess === 'success') {
      toast({
        title: "🎉 Purchase Successful!",
        description: itemName 
          ? `You have successfully purchased "${decodeURIComponent(itemName)}". The collectible has been added to your collection.`
          : "Your purchase was completed successfully. The collectible has been added to your collection.",
        duration: 8000,
        className: "bg-green-500/90 text-white border-green-400"
      });
      // Clear the URL parameters after showing the message
      window.history.replaceState({}, document.title, location.pathname);
    }

    if (tradeSuccess === 'success') {
      toast({
        title: "🚀 Trade Executed Successfully!",
        description: tradeType 
          ? `Your ${tradeType.toUpperCase()} order has been successfully executed and recorded in your trade history.`
          : "Your trade has been successfully executed and recorded.",
        duration: 8000,
        className: "bg-blue-500/90 text-white border-blue-400"
      });
      // Clear the URL parameters after showing the message
      window.history.replaceState({}, document.title, location.pathname);
    }

    if (paymentSuccess === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again anytime.",
        duration: 5000,
        className: "bg-orange-500/90 text-white border-orange-400"
      });
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.search, toast]);

  useEffect(() => {
    filterAndSortCollectibles();
  }, [collectibles, searchTerm, selectedCategory, selectedRarity, sortBy]);

  const dummyCollectibles: Collectible[] = [
    {
      id: 'dummy-1',
      title: 'Digital Art #1',
      description: 'A unique piece of digital art.',
      price: 0.05,
      category: 'art',
      rarity: 'rare',
      image_url: '/placeholder.svg',
      user_id: 'dummy-user-1',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dummy-2',
      title: 'Epic Music Track',
      description: 'An epic music track for your collection.',
      price: 0.03,
      category: 'music',
      rarity: 'epic',
      image_url: '/placeholder.svg',
      user_id: 'dummy-user-2',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dummy-3',
      title: 'Gaming Asset',
      description: 'A rare gaming asset for in-game use.',
      price: 0.1,
      category: 'gaming',
      rarity: 'legendary',
      image_url: '/placeholder.svg',
      user_id: 'dummy-user-3',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dummy-4',
      title: 'Video Clip',
      description: 'A short memorable video clip.',
      price: 0.02,
      category: 'video',
      rarity: 'common',
      image_url: '/placeholder.svg',
      user_id: 'dummy-user-4',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dummy-5',
      title: 'Photography Shot',
      description: 'A stunning digital photograph.',
      price: 0.04,
      category: 'photography',
      rarity: 'rare',
      image_url: '/placeholder.svg',
      user_id: 'dummy-user-5',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dummy-6',
      title: 'Collectible Item #1',
      description: 'A must-have collectible item.',
      price: 0.08,
      category: 'collectible',
      rarity: 'epic',
      image_url: '/placeholder.svg',
      user_id: 'dummy-user-6',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dummy-7',
      title: 'Digital Art #2',
      description: 'Another unique piece of digital art.',
      price: 0.06,
      category: 'art',
      rarity: 'rare',
      image_url: '/placeholder.svg',
      user_id: 'dummy-user-7',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dummy-8',
      title: 'Music Sample',
      description: 'A sample of an upcoming music release.',
      price: 0.01,
      category: 'music',
      rarity: 'common',
      image_url: '/placeholder.svg',
      user_id: 'dummy-user-8',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dummy-9',
      title: 'Gaming Skin',
      description: 'A rare skin for your favorite game.',
      price: 0.09,
      category: 'gaming',
      rarity: 'legendary',
      image_url: '/placeholder.svg',
      user_id: 'dummy-user-9',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dummy-10',
      title: 'Video Highlight',
      description: 'A highlight from a popular video.',
      price: 0.07,
      category: 'video',
      rarity: 'epic',
      image_url: '/placeholder.svg',
      user_id: 'dummy-user-10',
      created_at: new Date().toISOString(),
    },
  ];

  const state = useSelector((state: RootState) => state.collectibles);
  
  const fetchCollectibles = () => {
    // Fetch collectibles from Redux store instead of Supabase
    setCollectibles(state.items.length > 0 ? state.items : dummyCollectibles);
    setLoading(false);
  };

  const filterAndSortCollectibles = () => {
    let filtered = [...collectibles];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Rarity filter
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(item => item.rarity === selectedRarity);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredCollectibles(filtered);
  };

  const categories = ['all', 'art', 'music', 'video', 'gaming', 'collectible', 'photography'];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <RaffleWidget />
      
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Digital
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Marketplace</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Discover and acquire exceptional digital collectibles from renowned creators. Each purchase is secured by blockchain technology.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
          {/* Success Notification Areas */}
          {new URLSearchParams(location.search).get('payment') === 'success' && (
            <div className="bg-green-800/50 border border-green-700/50 rounded-xl p-4 mb-4 flex items-center space-x-3 text-green-300">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check size={16} className="text-green-400" />
              </div>
              <div>
                <div className="font-semibold">Purchase Successful! 🎉</div>
                <div className="text-sm text-green-400">
                  {new URLSearchParams(location.search).get('item') 
                    ? `"${decodeURIComponent(new URLSearchParams(location.search).get('item')!)}" has been added to your collection.`
                    : 'Your collectible has been added to your collection.'
                  }
                </div>
              </div>
            </div>
          )}

          {new URLSearchParams(location.search).get('trade') === 'success' && (
            <div className="bg-blue-800/50 border border-blue-700/50 rounded-xl p-4 mb-4 flex items-center space-x-3 text-blue-300">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <TrendingUp size={16} className="text-blue-400" />
              </div>
              <div>
                <div className="font-semibold">Trade Executed Successfully! 🚀</div>
                <div className="text-sm text-blue-400">
                  Your {new URLSearchParams(location.search).get('type')?.toUpperCase() || 'trade'} order has been completed and recorded.
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search collectibles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              {rarities.map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarity === 'all' ? 'All Rarities' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none flex-1"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="alphabetical">Alphabetical</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-slate-400">
            Showing {filteredCollectibles.length} of {collectibles.length} collectibles
          </p>
        </div>

        {/* Collectibles Grid */}
        {filteredCollectibles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-400 text-lg mb-2">No collectibles found</p>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredCollectibles.map((collectible) => (
              <CollectibleCard
                key={collectible.id}
                collectible={collectible}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;
