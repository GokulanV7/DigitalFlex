import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  collectiblesApi, 
  transactionsApi, 
  activitiesApi, 
  analyticsApi 
} from '@/lib/supabaseQueries';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserCollectibles from '@/components/UserCollectibles';
import UserStats from '@/components/UserStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { 
  Activity, BarChart3, ChevronUp, CircleDollarSign, Clock, Coins, 
  CreditCard, Flame, History, Package, Sparkles, TrendingUp, Zap 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioGrowth, setPortfolioGrowth] = useState(0);
  const [activities, setActivities] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch user's collectibles
      const userCollectibles = await collectiblesApi.fetchUserCollectibles(user.id);
      setCollectibles(userCollectibles);
      
      // Fetch user activities
      const userActivities = await activitiesApi.fetchUserActivities(user.id);
      setActivities(userActivities);
      
      // Get portfolio summary
      const summary = await analyticsApi.getPortfolioSummary(user.id);
      setPortfolioSummary(summary);
      setPortfolioValue(summary.totalValue);
      
      // Calculate portfolio growth
      // In a real app, you would compare with historical data
      // For demo, we'll use a random value between -5% and +15%
      setPortfolioGrowth(parseFloat((Math.random() * 20 - 5).toFixed(2)));
      
      // Get category distribution
      const categories = await analyticsApi.getCategoryDistribution(user.id);
      setCategoryDistribution(categories);
      
      // Generate market trends for demo
      generateMarketTrends();
      
      // Generate portfolio history data
      // In a real app, this would come from a portfolio_snapshots table
      generatePortfolioData();
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePortfolioData = () => {
    // Generate mock portfolio history data for the chart
    const today = new Date();
    const data = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Base value that grows over time with some randomness
      const baseValue = 10 + (30 - i) * 0.8;
      const randomFactor = Math.random() * 4 - 2; // Random fluctuation between -2 and 2
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: parseFloat((baseValue + randomFactor).toFixed(2))
      });
    }
    
    setPortfolioData(data);
  };

  const generateMarketTrends = () => {
    // Generate mock market trend data for categories
    const categories = ['Art', 'Music', 'Gaming', 'Photography', 'Video'];
    const data = categories.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 100) + 20,
      growth: parseFloat((Math.random() * 20 - 5).toFixed(1))
    }));
    
    setMarketTrends(data);
  };

  const formatCurrency = (value) => {
    return parseFloat(value).toFixed(2);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'purchase': return <CreditCard className="text-green-400" />;
      case 'sale': return <Coins className="text-purple-400" />;
      case 'creation': return <Sparkles className="text-blue-400" />;
      case 'trade': return <TrendingUp className="text-orange-400" />;
      default: return <Activity className="text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {user?.user_metadata?.full_name || 'Collector'}
              </span>
            </h1>
            <p className="text-slate-400">Manage your digital assets and track your portfolio performance</p>
          </div>
          
          <div className="flex gap-3">
            <Link to="/create" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-all">
              <Sparkles size={16} />
              <span>Create</span>
            </Link>
            <Link to="/marketplace" className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-all">
              <Zap size={16} />
              <span>Marketplace</span>
            </Link>
          </div>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-400 text-sm font-normal">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-white">{formatCurrency(portfolioValue)} ETH</div>
                <div className={`flex items-center text-sm ${portfolioGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioGrowth >= 0 ? <ChevronUp size={16} /> : <ChevronUp size={16} className="rotate-180" />}
                  <span>{Math.abs(portfolioGrowth)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-400 text-sm font-normal">Total Collectibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-white">27</div>
                <Package size={20} className="text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-400 text-sm font-normal">Monthly Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-white">5.23 ETH</div>
                <BarChart3 size={20} className="text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-400 text-sm font-normal">Hot Collectibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-white">3</div>
                <Flame size={20} className="text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="collectibles" className="data-[state=active]:bg-purple-600">My Collectibles</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-600">Activity</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Portfolio Chart */}
              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription className="text-slate-400">30-day value trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer config={{ value: { theme: { light: '#8b5cf6', dark: '#8b5cf6' } } }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={portfolioData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="date" 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                          />
                          <YAxis 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value} ETH`}
                          />
                          <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`${value} ETH`, 'Value']} />} />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--color-value)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#8b5cf6' }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>Recent Activity</span>
                    <History size={18} className="text-slate-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity, index) => (
                        <div key={activity.id || index} className="flex items-start gap-3">
                          <div className="mt-0.5 p-1.5 rounded-full bg-slate-700/50">
                            {getActivityIcon(activity.activity_type)}
                          </div>
                          <div>
                            <p className="text-sm text-white font-medium">{activity.description}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(activity.created_at).toLocaleDateString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock className="text-slate-500 mb-2" size={24} />
                      <p className="text-slate-400">No recent activity</p>
                      <p className="text-slate-500 text-sm">Your latest activities will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Market Trends */}
              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle>Market Trends</CardTitle>
                  <CardDescription className="text-slate-400">Category performance this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer config={{ 
                      value: { theme: { light: '#8b5cf6', dark: '#8b5cf6' } },
                      growth: { theme: { light: '#22c55e', dark: '#22c55e' } }
                    }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={marketTrends}>
                          <XAxis 
                            dataKey="name" 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {marketTrends.map((trend, index) => (
                      <div key={index} className="bg-slate-700/20 rounded-lg p-3 text-center">
                        <p className="text-sm text-slate-400">{trend.name}</p>
                        <p className={`text-sm font-semibold ${trend.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trend.growth >= 0 ? '+' : ''}{trend.growth}%
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* User Stats */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                  <CardDescription className="text-slate-400">Performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserStats />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="collectibles">
            <UserCollectibles />
          </TabsContent>
          
          <TabsContent value="activity">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription className="text-slate-400">Your recent trades and purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="grid grid-cols-4 md:grid-cols-5 py-2 px-4 text-xs text-slate-400 font-medium">
                    <div>Type</div>
                    <div>Item</div>
                    <div className="hidden md:block">Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  
                  {/* Sample transactions - would come from API in real app */}
                  <TransactionRow
                    type="purchase"
                    item="Cyber Genesis NFT"
                    date="Jun 12, 2023"
                    amount="1.8 ETH"
                    status="completed"
                  />
                  <TransactionRow
                    type="sale"
                    item="Golden Dragon Collection"
                    date="May 29, 2023"
                    amount="2.5 ETH"
                    status="completed"
                  />
                  <TransactionRow
                    type="trade"
                    item="Nature's Harmony"
                    date="May 24, 2023"
                    amount="0.9 ETH"
                    status="pending"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer config={{ 
                      sales: { theme: { light: '#22c55e', dark: '#22c55e' } },
                      expenses: { theme: { light: '#ef4444', dark: '#ef4444' } },
                      profit: { theme: { light: '#3b82f6', dark: '#3b82f6' } }
                    }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            { name: 'Jan', sales: 4, expenses: 2, profit: 2 },
                            { name: 'Feb', sales: 3, expenses: 1, profit: 2 },
                            { name: 'Mar', sales: 5, expenses: 2, profit: 3 },
                            { name: 'Apr', sales: 7, expenses: 3, profit: 4 },
                            { name: 'May', sales: 6, expenses: 2, profit: 4 },
                            { name: 'Jun', sales: 9, expenses: 3, profit: 6 }
                          ]}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <XAxis 
                            dataKey="name" 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value} ETH`}
                          />
                          <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`${value} ETH`, 'Value']} />} />
                          <Bar dataKey="sales" stackId="a" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="expenses" stackId="a" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  
                  <div className="flex justify-center space-x-6 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-slate-400">Sales</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm text-slate-400">Expenses</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-slate-400">Profit</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle>Collectible Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md"></div>
                        <div>
                          <p className="text-white font-medium">Cyber Genesis NFT</p>
                          <p className="text-xs text-slate-400">Purchased Jun 12, 2023</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 flex items-center gap-1 justify-end">
                          <ChevronUp size={14} />
                          <span>32%</span>
                        </p>
                        <p className="text-xs text-slate-400">Since purchase</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-md"></div>
                        <div>
                          <p className="text-white font-medium">Golden Dragon Collection</p>
                          <p className="text-xs text-slate-400">Sold May 29, 2023</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 flex items-center gap-1 justify-end">
                          <ChevronUp size={14} />
                          <span>18%</span>
                        </p>
                        <p className="text-xs text-slate-400">Profit margin</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md"></div>
                        <div>
                          <p className="text-white font-medium">Nature's Harmony</p>
                          <p className="text-xs text-slate-400">Trading in progress</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 flex items-center gap-1 justify-end">
                          <Clock size={14} />
                          <span>Pending</span>
                        </p>
                        <p className="text-xs text-slate-400">Estimated: +5%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

// Transaction Row Component
const TransactionRow = ({ type, item, date, amount, status }) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'purchase': return <CreditCard size={16} className="text-green-400" />;
      case 'sale': return <Coins size={16} className="text-purple-400" />;
      case 'trade': return <TrendingUp size={16} className="text-orange-400" />;
      default: return <Activity size={16} className="text-slate-400" />;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };
  
  return (
    <div className="grid grid-cols-4 md:grid-cols-5 py-3 px-4 bg-slate-700/20 rounded-lg mb-2 items-center">
      <div className="flex items-center gap-2">
        {getTypeIcon()}
        <span className="capitalize text-sm text-white">{type}</span>
      </div>
      <div className="text-sm text-slate-300">{item}</div>
      <div className="hidden md:block text-sm text-slate-400">{date}</div>
      <div className="text-sm font-medium text-white">{amount}</div>
      <div>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()} capitalize`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
