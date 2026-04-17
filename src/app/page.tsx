"use client";

import { motion } from "framer-motion";
import { 
  Leaf, 
  MessageSquare, 
  CloudSun, 
  TrendingUp, 
  Camera, 
  Settings, 
  LayoutDashboard,
  Bell,
  Thermometer,
  Droplets,
  Wind,
  Search,
  ChevronRight,
  TrendingDown,
  AlertCircle,
  Sprout
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

const MANDI_DATA = [
  { crop: "Wheat", price: "2,450", change: "+45", up: true },
  { crop: "Onion", price: "1,800", change: "-20", up: false },
  { crop: "Potato", price: "1,250", change: "+10", up: true },
  { crop: "Tomato", price: "2,200", change: "+150", up: true },
  { crop: "Rice", price: "3,100", change: "+05", up: true },
  { crop: "Cotton", price: "6,700", change: "-100", up: false },
  { crop: "Mustard", price: "5,400", change: "+30", up: true },
  { crop: "Soybean", price: "4,600", change: "+12", up: true },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const { profile, dictionary } = useUser();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const menuItems = [
    { id: "market", name: dictionary?.dashboard?.market || "Market", icon: TrendingUp, color: "bg-amber-50 text-amber-600 border-amber-100" },
    { id: "yield", name: dictionary?.dashboard?.yield || "Yield", icon: Sprout, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { id: "irrigation", name: "Irrigation", icon: Droplets, color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
    { id: "vision", name: "Vision", icon: Camera, color: "bg-purple-50 text-purple-600 border-purple-100" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 pb-32">
      {/* Live Mandi Ticker */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100 overflow-hidden h-10 flex items-center max-w-md mx-auto">
        <div className="animate-ticker flex items-center gap-8 whitespace-nowrap px-4">
          {[...MANDI_DATA, ...MANDI_DATA].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[10px] font-bold">
              <span className="text-zinc-400 uppercase tracking-tighter">{item.crop}</span>
              <span className="text-emerald-900">₹{item.price}</span>
              <span className={item.up ? "text-emerald-500" : "text-red-500"}>
                {item.up ? "▲" : "▼"} {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats - Priority Irrigation */}
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 gap-3 pt-8"
      >
        <Link href="/irrigation" className="bg-white p-4 rounded-[32px] border border-emerald-50 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Droplets size={16} />
            </div>
            <span className="text-[8px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full tracking-tighter">Optimal</span>
          </div>
          <div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Field Moisture</div>
            <div className="text-lg font-black text-emerald-950 tracking-tighter">82% <span className="text-[10px] text-zinc-400 font-medium tracking-normal">Safe</span></div>
          </div>
        </Link>
        
        <Link href="/yield" className="bg-white p-4 rounded-[32px] border border-emerald-50 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sprout size={16} />
            </div>
            <span className="text-[8px] font-black text-amber-500 uppercase bg-amber-50 px-2 py-0.5 rounded-full tracking-tighter">Gold</span>
          </div>
          <div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Yield Forecast</div>
            <div className="text-lg font-black text-emerald-950 tracking-tighter">92% <span className="text-[10px] text-zinc-400 font-medium tracking-normal">Potential</span></div>
          </div>
        </Link>
      </motion.div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-emerald-800/60 text-[10px] font-bold uppercase tracking-[0.2em]">
            {dictionary?.dashboard?.greeting || "Namaste"}, {profile.name || "Farmer"}
          </h2>
          <h1 className="text-3xl font-black text-emerald-900 tracking-tight">
            KrishiAI <span className="text-emerald-500 italic">Elite</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/notifications" className="p-3 bg-white rounded-2xl shadow-sm border border-emerald-50 shadow-emerald-900/5 relative active:scale-90 transition-transform">
            <Bell size={20} className="text-emerald-600" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Link>
          <button className="p-3 bg-white rounded-2xl shadow-sm border border-emerald-50 shadow-emerald-900/5 active:scale-90 transition-transform">
            <Settings size={20} className="text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Weather Smart Widget */}
      <motion.div 
        {...fadeInUp}
        className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[32px] p-6 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 opacity-80 text-[10px] font-bold uppercase tracking-widest">
              <MapPin size={12} className="" /> {profile.location || "Local Field"}
            </div>
            <div className="text-4xl font-black">28°C</div>
            <div className="text-xs font-medium text-emerald-100">Partly Cloudy • Feels like 30°C</div>
          </div>
          <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
            <CloudSun size={32} />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10">
          <div className="text-center space-y-1">
            <Droplets size={16} className="mx-auto text-emerald-300" />
            <div className="text-[10px] opacity-60 font-bold uppercase">Humidity</div>
            <div className="text-xs font-black">64%</div>
          </div>
          <div className="text-center space-y-1">
            <Wind size={16} className="mx-auto text-emerald-300" />
            <div className="text-[10px] opacity-60 font-bold uppercase">Wind</div>
            <div className="text-xs font-black">12 km/h</div>
          </div>
          <div className="text-center space-y-1">
            <Thermometer size={16} className="mx-auto text-emerald-300" />
            <div className="text-[10px] opacity-60 font-bold uppercase">UV Index</div>
            <div className="text-xs font-black">Moderate</div>
          </div>
        </div>

        <div className="mt-4 bg-white/10 rounded-2xl p-3 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-tighter">Smart Advisory for {profile.cropType || "Wheat"}</span>
            <AlertCircle size={14} className="text-emerald-300" />
          </div>
          <p className="text-[10px] text-emerald-50">High humidity risk: Check for fungal growth today.</p>
        </div>
      </motion.div>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, idx) => {
          const content = (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-5 rounded-[28px] border-2 border-transparent hover:border-emerald-600/10 transition-all active:scale-95 flex flex-col gap-4 shadow-sm h-full ${item.color}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <item.icon size={24} />
              </div>
              <div>
                <span className="font-black text-sm tracking-tight">{item.name}</span>
                <div className="flex items-center gap-1 opacity-60 text-[9px] font-bold uppercase mt-0.5">
                  Launch <ArrowRight size={8} />
                </div>
              </div>
            </motion.div>
          );

          if (item.id === "chat") return <Link key={item.id} href="/chat" className="h-full">{content}</Link>;
          if (item.id === "vision") return <Link key={item.id} href="/vision" className="h-full">{content}</Link>;
          if (item.id === "market") return <Link key={item.id} href="/market" className="h-full">{content}</Link>;
          if (item.id === "irrigation") return <Link key={item.id} href="/irrigation" className="h-full">{content}</Link>;
          if (item.id === "yield") return <Link key={item.id} href="/yield" className="h-full">{content}</Link>;
          return <div key={item.id}>{content}</div>;
        })}
      </div>

      {/* Field Intelligence News */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.2em]">Field Intelligence</h3>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Analysis</span>
        </div>
        
        <div className="glass-card p-5 flex gap-4 items-center bg-white shadow-sm border border-emerald-50 rounded-[32px]">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
            <Leaf size={28} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-emerald-950 leading-tight">Your {profile.cropType || "Wheat"} Hub</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Stage: Sowing complete. High probability of success in {profile.location || "your area"}.</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          onClick={() => setActiveTab("home")}
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[9px] uppercase font-black tracking-widest">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab("chat")}
          className={`nav-item active:scale-90 transition-transform`}
        >
          <div className="p-4 bg-emerald-600 rounded-3xl -mt-14 shadow-2xl shadow-emerald-500/40 text-white border-[6px] border-[#f8faf8]">
            <MessageSquare size={28} fill="currentColor" />
          </div>
          <span className="text-[9px] uppercase font-black tracking-widest mt-1">Assistant</span>
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
        >
          <Settings size={24} />
          <span className="text-[9px] uppercase font-black tracking-widest">Profile</span>
        </button>
      </div>
    </div>
  );
}

// Helper icons missing from lucide
function MapPin({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
