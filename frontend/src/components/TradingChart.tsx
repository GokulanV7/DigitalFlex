
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, BarChart3, BarChart2 } from 'lucide-react';

interface PriceData {
  time: string;
  price: number;
  volume: number;
}

const TradingChart = ({ collectible, ratio }: { collectible?: any; ratio?: number }) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [chartType, setChartType] = useState<'line' | 'area' | 'candlestick'>('area');
  const [timeframe, setTimeframe] = useState<'1h' | '1d' | '1w' | '1m'>('1d');

  useEffect(() => {
    generateMockData();
  }, [timeframe]);

  const generateMockData = () => {
    const now = new Date();
    const data: PriceData[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      let basePrice = 2.5;
      let volatility = 0.3;
      
      if (collectible && ratio) {
        basePrice = collectible.price;
        volatility = basePrice * 0.1; // Adjust volatility based on the base price
        const adjustedPrice = basePrice * ratio * (1 + (Math.random() - 0.5) * 0.1);
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: Math.max(0, adjustedPrice),
          volume: Math.floor(Math.random() * 100) + 20
        });
      } else {
        const price = basePrice + (Math.random() - 0.5) * volatility;
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: Math.max(0, price),
          volume: Math.floor(Math.random() * 100) + 20
        });
      }
    }
    
    setPriceData(data);
  };

  const chartTypes = [
    { id: 'area', label: 'Area', icon: BarChart3 },
    { id: 'line', label: 'Line', icon: TrendingUp },
    { id: 'candlestick', label: 'Candles', icon: BarChart2 }
  ];

  const timeframes = [
    { id: '1h', label: '1H' },
    { id: '1d', label: '1D' },
    { id: '1w', label: '1W' },
    { id: '1m', label: '1M' }
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Price Chart {collectible ? `- ${collectible.title}` : ''}</h3>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-green-400">
              {priceData[priceData.length - 1]?.price.toFixed(3)} ETH
            </span>
            <span className="text-green-400 text-sm">+5.23%</span>
            {collectible && ratio && (
              <span className="text-purple-400 text-sm">Ratio: {ratio.toFixed(2)}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Chart Type Selector */}
          <div className="flex bg-slate-700/50 rounded-lg p-1">
            {chartTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id as any)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-all ${
                  chartType === type.id
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <type.icon size={14} />
                <span>{type.label}</span>
              </button>
            ))}
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex bg-slate-700/50 rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id as any)}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  timeframe === tf.id
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                domain={['dataMin - 0.1', 'dataMax + 0.1']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
                className="animate-scale-in"
              />
            </AreaChart>
          ) : (
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                domain={['dataMin - 0.1', 'dataMax + 0.1']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                className="animate-scale-in"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradingChart;
