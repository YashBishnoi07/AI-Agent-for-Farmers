"use client";

import { motion } from "framer-motion";
import { 
  Droplets, 
  ChevronLeft, 
  Calendar, 
  Wind, 
  Thermometer, 
  CloudRain,
  Sun,
  Layers,
  Mountain,
  CheckCircle2,
  Info,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useState, useMemo } from "react";

export default function IrrigationPlannerPage() {
  const { profile, updateProfile } = useUser();
  const [isLogged, setIsLogged] = useState(false);

  // Simple moisture calculation logic
  const { moistureLevel, daysSince, healthStatus } = useMemo(() => {
    const last = new Date(profile.lastWateredDate || new Date().toISOString());
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

    let consumptionRate = 15; // Loam default
    if (profile.soilType === "Clay") consumptionRate = 10;
    if (profile.soilType === "Sandy") consumptionRate = 25;

    const level = Math.max(0, 100 - (diffDays * consumptionRate));
    
    let status = "Healthy";
    if (level < 40) status = "Thirsty";
    if (level < 20) status = "Critical";

    return { moistureLevel: level, daysSince: diffDays, healthStatus: status };
  }, [profile.lastWateredDate, profile.soilType]);

  const handleLogWatering = () => {
    updateProfile({ lastWateredDate: new Date().toISOString() });
    setIsLogged(true);
    setTimeout(() => setIsLogged(false), 3000);
  };

  const getSoilIcon = () => {
    if (profile.soilType === "Clay") return <Mountain size={20} />;
    if (profile.soilType === "Sandy") return <Droplets size={20} />;
    return <Layers size={20} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf8] p-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm border border-emerald-50 text-emerald-800">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-emerald-950 tracking-tight">Watering Planner</h1>
          <p className="text-[10px] text-emerald-600/60 uppercase tracking-widest font-bold">Field Moisture AI</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Moisture Dial Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-8 shadow-xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[10px] font-black text-emerald-800/40 uppercase tracking-widest">Soil Moisture</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-emerald-950">{moistureLevel}%</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  healthStatus === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 
                  healthStatus === 'Thirsty' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                }`}>
                  {healthStatus}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-1">
                {getSoilIcon()}
              </div>
              <span className="text-[9px] font-black text-emerald-800/30 uppercase tracking-tighter">{profile.soilType} Soil</span>
            </div>
          </div>

          {/* Simulated Gauge */}
          <div className="h-4 w-full bg-emerald-50 rounded-full overflow-hidden mb-6">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${moistureLevel}%` }}
              className={`h-full transition-colors duration-1000 ${
                moistureLevel > 40 ? 'bg-emerald-500' : moistureLevel > 20 ? 'bg-amber-500' : 'bg-red-500'
              }`}
            />
          </div>

          <p className="text-xs font-medium text-emerald-800/60 leading-relaxed text-center italic">
            "Your {profile.soilType} soil is {healthStatus.toLowerCase()}. {moistureLevel < 50 ? 'Recommend watering within 24 hours.' : 'Current moisture is optimal for growth.'}"
          </p>
        </motion.div>

        {/* Action Button */}
        <button 
          onClick={handleLogWatering}
          disabled={isLogged}
          className={`w-full py-6 rounded-[32px] font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
            isLogged ? 'bg-emerald-50 text-emerald-600 shadow-none' : 'bg-emerald-600 text-white shadow-emerald-500/20'
          }`}
        >
          {isLogged ? (
            <>
              <CheckCircle2 size={24} /> Watered Today
            </>
          ) : (
            <>
              <Droplets size={24} /> Log Watering Now
            </>
          )}
        </button>

        {/* 7-Day Watering Calendar */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.2em]">Next 7 Days</h3>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
              Weather Synced <CloudRain size={10} />
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-2">
            {[
              { day: "Today", moisture: moistureLevel, icon: Sun, action: "Water" },
              { day: "Fri", moisture: moistureLevel - 15, icon: Sun, action: "Skip" },
              { day: "Sat", moisture: moistureLevel - 30, icon: CloudRain, action: "Natural" },
              { day: "Sun", moisture: moistureLevel + 20, icon: CloudRain, action: "Skip" },
              { day: "Mon", moisture: moistureLevel - 5, icon: Sun, action: "Water" },
              { day: "Tue", moisture: moistureLevel - 20, icon: Sun, action: "Water" },
              { day: "Wed", moisture: moistureLevel - 35, icon: Wind, action: "Heavy" },
            ].map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 min-w-[60px] p-3 bg-white rounded-2xl border border-emerald-50 shadow-sm">
                <span className="text-[8px] font-black text-emerald-800/30 uppercase tracking-tighter">{day.day}</span>
                <day.icon size={18} className="text-emerald-500" />
                <div className="text-[9px] font-black text-emerald-950">
                  {day.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Advice Card */}
        <div className="bg-emerald-950 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="flex gap-4 items-start relative z-10">
            <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-300 flex-shrink-0">
              <Info size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black mb-1">Smart Tip for {profile.cropType || "your crop"}</h4>
              <p className="text-xs text-emerald-100/60 leading-relaxed font-medium">
                Early morning watering (5 AM - 8 AM) reduces fungal risk and evaporation loss by up to 30%.
              </p>
              <button className="mt-4 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 group">
                Read Full Guide <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
