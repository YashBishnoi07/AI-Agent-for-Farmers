"use client";

import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Sprout, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Info,
  Beaker,
  Droplets,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { calculateYieldMetrics, YieldMetrics } from "@/utils/yieldUtils";
import { AIService } from "@/services/aiService";
import { useState, useEffect, useCallback } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function YieldForecastingPage() {
  const { profile, dictionary } = useUser();
  const [metrics, setMetrics] = useState<YieldMetrics | null>(null);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (profile.seedingDate && profile.harvestDate) {
      const calculatedMetrics = calculateYieldMetrics(profile);
      setMetrics(calculatedMetrics);
    }
  }, [profile]);

  const generateInsight = useCallback(async () => {
    if (!metrics) return;
    
    setIsGenerating(true);
    setAiInsight("");
    try {
      const result = await AIService.getYieldInsight(profile, metrics);
      setAiInsight(result.text);
    } catch (err) {
      setAiInsight("An unexpected error occurred while consulting KrishiAI.");
    } finally {
      setIsGenerating(false);
    }
  }, [profile, metrics]);

  // Generate initial insight once metrics are ready
  useEffect(() => {
    if (metrics && !aiInsight && !isGenerating) {
      generateInsight();
    }
  }, [metrics, aiInsight, isGenerating, generateInsight]);

  if (!metrics) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf8] p-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm border border-emerald-50 text-emerald-800">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-emerald-950 tracking-tight">Yield Predictor</h1>
          <p className="text-[10px] text-emerald-600/60 uppercase tracking-widest font-bold font-mono">AI Forecasting</p>
        </div>
      </div>

      {/* Main Maturity Dial */}
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="bg-white rounded-[40px] p-8 border border-emerald-50 shadow-sm relative overflow-hidden mb-6"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-emerald-50"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 88}
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - metrics.maturity / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-emerald-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-emerald-950">{metrics.maturity}%</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Matured</span>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-black text-emerald-950">{profile.cropType || "Wheat"} Progress</h2>
            <p className="text-xs text-zinc-400 font-medium">Estimated harvest in <span className="text-emerald-600 font-black">{metrics.daysLeft} days</span></p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="bg-white p-5 rounded-[32px] border border-emerald-50 shadow-sm space-y-3"
        >
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Yield Potential</div>
            <div className="text-xl font-black text-emerald-950">{metrics.yieldPotential}%</div>
          </div>
          <div className="h-1 w-full bg-emerald-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${metrics.yieldPotential}%` }}
              className="h-full bg-amber-400"
            />
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="bg-white p-5 rounded-[32px] border border-emerald-50 shadow-sm space-y-3"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Droplets size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Growth Rate</div>
            <div className="text-xl font-black text-emerald-950">{metrics.growthRate}</div>
          </div>
          <div className="text-[9px] font-bold text-emerald-600/60 uppercase">Optimal conditions</div>
        </motion.div>
      </div>

      {/* Yield Factors */}
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="bg-emerald-950 rounded-[40px] p-8 text-white mb-6 relative overflow-hidden"
      >
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
          <Beaker size={16} className="text-emerald-400" />
          Condition Breakdown
        </h3>
        
        <div className="space-y-6">
          <FactorRow label="Soil Nutrient Health" score={metrics.nutrientHealth} color="bg-emerald-400" />
          <FactorRow label="Water Consistency" score={metrics.waterConsistency} color="bg-cyan-400" />
          <FactorRow label="Pest Risk" score={metrics.pestRisk} color="bg-red-400" inverse />
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col gap-4">
             <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">AI Recommendation</p>
                <div className="text-xs text-emerald-100 font-medium leading-relaxed min-h-[40px]">
                  {isGenerating ? (
                    <div className="flex items-center gap-2 text-emerald-400/60 animate-pulse">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                      Consulting KrishiAI...
                    </div>
                  ) : (
                    aiInsight || "No insights generated yet."
                  )}
                </div>
              </div>
            </div>
            
            <button 
              onClick={generateInsight}
              disabled={isGenerating}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? "Processing..." : "Refresh Insights"}
              <TrendingUp size={14} />
            </button>
          </div>
        </div>

        {/* Weather Impact Overlay */}
        {metrics.weatherImpact.severity !== "low" && (
          <div className="mt-6 p-4 bg-amber-400/10 border border-amber-400/20 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">{metrics.weatherImpact.factor}</p>
              <p className="text-[11px] text-emerald-100 font-medium">{metrics.weatherImpact.description}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Timeline */}
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="bg-white rounded-[40px] p-8 border border-emerald-50 shadow-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-950">Milestones</h3>
          <Calendar size={16} className="text-emerald-300" />
        </div>
        
        <div className="space-y-6">
          <TimelineItem 
            date={new Date(profile.seedingDate).toLocaleDateString()} 
            title="Seeding Completed" 
            status="done" 
          />
          <TimelineItem 
            date="Today" 
            title="Maturity Phase" 
            status="active" 
          />
          <TimelineItem 
            date={new Date(profile.harvestDate || "").toLocaleDateString()} 
            title="Estimated Harvest" 
            status="pending" 
          />
        </div>
      </motion.div>
    </div>
  );
}

function FactorRow({ label, score, color, inverse = false }: { label: string, score: number, color: string, inverse?: boolean }) {
  const displayScore = inverse ? 100 - score : score;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span>{label}</span>
        <span className={displayScore < 40 ? "text-amber-400" : "text-white"}>{score}%</span>
      </div>
      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function TimelineItem({ date, title, status }: { date: string, title: string, status: 'done' | 'active' | 'pending' }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
          status === 'done' ? 'bg-emerald-500 text-white' : 
          status === 'active' ? 'border-2 border-emerald-500 bg-white' : 
          'bg-emerald-50'
        }`}>
          {status === 'done' && <CheckCircle2 size={10} />}
          {status === 'active' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
        </div>
        <div className="w-0.5 h-10 bg-emerald-50" />
      </div>
      <div className="flex-1 -mt-1">
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{date}</p>
        <p className={`text-xs font-black ${status === 'pending' ? 'text-zinc-400' : 'text-emerald-950'}`}>{title}</p>
      </div>
    </div>
  );
}
