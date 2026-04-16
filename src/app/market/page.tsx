"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronLeft, 
  MapPin, 
  Clock, 
  ArrowRight,
  Info,
  DollarSign,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const PRICE_TREND = [1800, 1850, 1820, 1900, 2100, 2050, 2200]; // 7 days of price data

export default function MarketPage() {
  const { profile } = useUser();

  // Simple sparkline path generator
  const getPath = () => {
    const max = Math.max(...PRICE_TREND);
    const min = Math.min(...PRICE_TREND);
    const range = max - min;
    const width = 300;
    const height = 100;
    
    return PRICE_TREND.map((p, i) => {
      const x = (i / (PRICE_TREND.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf8] p-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm border border-emerald-50 text-emerald-800">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-emerald-950 tracking-tight">Market Intelligence</h1>
          <p className="text-[10px] text-emerald-600/60 uppercase tracking-widest font-bold">Live Mandi Insights</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Trend Chart Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-6 shadow-xl shadow-emerald-900/5 border border-emerald-50 overflow-hidden relative"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[10px] font-black text-emerald-800/40 uppercase tracking-widest">Price Trend (7 Days)</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-950">₹2,200</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                  <TrendingUp size={12} /> +12%
                </span>
              </div>
            </div>
            <div className="bg-emerald-50 px-3 py-1 rounded-full">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{profile.cropType || "Wheat"}</span>
            </div>
          </div>

          <div className="relative h-24 w-full group">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d={getPath()}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-500"
              />
              {/* Dots */}
              {PRICE_TREND.map((p, i) => {
                const max = Math.max(...PRICE_TREND);
                const min = Math.min(...PRICE_TREND);
                const x = (i / (PRICE_TREND.length - 1)) * 300;
                const y = 100 - ((p - min) / (max - min)) * 100;
                return (
                  <circle 
                    key={i} 
                    cx={x} 
                    cy={y} 
                    r="3" 
                    className="fill-white stroke-emerald-500 stroke-2" 
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="flex justify-between mt-4 text-[9px] font-bold text-emerald-800/20 uppercase tracking-tighter">
            <span>Last Monday</span>
            <span>Today</span>
          </div>
        </motion.div>

        {/* Sell/Hold Advisor */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-600 rounded-[28px] p-5 text-white shadow-lg shadow-emerald-900/10">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <DollarSign size={20} />
            </div>
            <h3 className="text-sm font-black mb-1 leading-tight">Elite Advice</h3>
            <p className="text-[10px] text-emerald-100 font-medium">Market is peaking. Good time to SELL 40% of stock.</p>
          </div>
          <div className="bg-white rounded-[28px] p-5 border border-emerald-100 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 text-emerald-600">
              <Briefcase size={20} />
            </div>
            <h3 className="text-sm font-black text-emerald-950 mb-1 leading-tight">Transport</h3>
            <p className="text-[10px] text-emerald-800/40 font-medium">Estimated cost to nearest Mandi: ₹150/qtl</p>
          </div>
        </div>

        {/* Nearby Markets */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.2em]">Nearby Markets</h3>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Compare</span>
          </div>

          {[
            { name: "Azadpur Mandi", distance: "12km", price: "2,200", trend: "up" },
            { name: "Najafgarh Mandi", distance: "8km", price: "2,150", trend: "stable" },
            { name: "Narela Mandi", distance: "24km", price: "2,280", trend: "up" },
          ].map((mandi, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-5 rounded-[24px] border border-emerald-50 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-950">{mandi.name}</h4>
                  <p className="text-[10px] text-emerald-800/40 font-bold uppercase tracking-tight">{mandi.distance} • Open until 6PM</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-emerald-950">₹{mandi.price}</div>
                <div className={`text-[9px] font-black uppercase ${mandi.trend === 'up' ? 'text-emerald-500' : 'text-zinc-400'}`}>
                  {mandi.trend === 'up' ? '▲ Rising' : '● Stable'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
