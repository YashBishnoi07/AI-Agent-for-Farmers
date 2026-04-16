"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  ChevronLeft, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Scan,
  Sprout,
  Info
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function VisionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    
    try {
      const response = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage }),
      });
      const data = await response.json();
      setResult(data.text);
    } catch (error) {
      console.error("Vision Analysis Error:", error);
      setResult("Diagnosis failed. Please check your internet connection and API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf8] p-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm border border-emerald-50 text-emerald-800">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-emerald-950 tracking-tight">Crop Diagnosis</h1>
          <p className="text-[10px] text-emerald-600/60 uppercase tracking-widest font-bold">AI Visual Expert</p>
        </div>
      </div>

      {!selectedImage ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-8"
        >
          <div className="w-40 h-40 rounded-[30%] bg-white flex items-center justify-center border-2 border-dashed border-emerald-500/30 shadow-2xl shadow-emerald-900/5 relative group">
            <Camera size={56} className="text-emerald-500 transition-transform group-hover:scale-110" />
            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-xl shadow-lg">
              <Sprout size={20} />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-xl font-black text-emerald-950">Show me the problem</h2>
            <p className="text-sm text-emerald-800/60 max-w-[240px] mx-auto leading-relaxed font-medium">
              Take a clear photo of the leaf, fruit, or pest issue for a rapid AI diagnosis.
            </p>
          </div>
          
          <div className="w-full max-w-xs space-y-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-emerald-600 text-white p-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 transition-all active:scale-95 group"
            >
              <Camera size={24} className="group-hover:rotate-12 transition-transform" />
              <span className="font-black">Open Camera</span>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white text-emerald-800 p-5 rounded-3xl flex items-center justify-center gap-3 shadow-sm border border-emerald-100 hover:bg-emerald-50 transition-all active:scale-95"
            >
              <Upload size={20} />
              <span className="font-bold">Choose from Gallery</span>
            </button>
          </div>

          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            className="hidden" 
          />
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="relative aspect-square w-full rounded-[40px] overflow-hidden bg-white shadow-2xl shadow-emerald-900/10 border-4 border-white">
            <img 
              src={selectedImage} 
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Selected crop"
            />
            {!isAnalyzing && !result && (
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-emerald-900 shadow-lg border border-emerald-100"
              >
                <X size={20} />
              </button>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-emerald-600/10 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <Loader2 size={64} className="text-emerald-600 animate-spin" />
                  <Scan size={44} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600/50" />
                </div>
                <div className="bg-white/90 px-6 py-2 rounded-full shadow-lg border border-emerald-100">
                  <p className="text-emerald-900 font-black text-xs uppercase tracking-widest animate-pulse">Analyzing Tissues...</p>
                </div>
              </div>
            )}
          </div>

          {!result && !isAnalyzing && (
            <button 
              onClick={handleAnalyze}
              className="w-full bg-emerald-600 py-5 rounded-[24px] font-black text-white shadow-xl shadow-emerald-900/10 active:scale-95 transition-all text-lg"
            >
              Analyze Crop Health
            </button>
          )}

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-6 shadow-xl shadow-emerald-900/5 border border-emerald-50 space-y-6"
              >
                {/* Confidence Meter */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-800/40">
                    <span>AI Confidence</span>
                    <span className="text-emerald-600">{result.match(/\[CONFIDENCE\]:?\s*(.*)/)?.[1] || "95%"}</span>
                  </div>
                  <div className="h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: result.match(/\[CONFIDENCE\]:?\s*(.*)/)?.[1] || "95%" }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-50">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Diagnosis</h4>
                    <p className="text-sm font-bold text-emerald-950">{result.match(/\[DIAGNOSIS\]:?\s*(.*)/)?.[1] || "Analyzing..."}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-600 rounded-2xl text-white">
                      <h4 className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Organic Remedy</h4>
                      <p className="text-[11px] font-medium leading-relaxed">{result.match(/\[ORGANIC_REMEDY\]:?\s*(.*)/)?.[1] || "Natural care recommended."}</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-emerald-100">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1">Expert Tip</h4>
                      <p className="text-[11px] font-medium text-emerald-800/60 leading-relaxed">{result.match(/\[EXPERT_TIP\]:?\s*(.*)/)?.[1] || "Monitor daily."}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Prevention</h4>
                    <p className="text-[11px] font-medium text-zinc-600 leading-relaxed">{result.match(/\[PREVENTION\]:?\s*(.*)/)?.[1] || "Standard crop hygiene."}</p>
                  </div>
                </div>

                <div className="h-px bg-emerald-50 w-full mt-4" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="w-full py-2 text-xs font-black text-emerald-600 hover:text-emerald-800 transition-colors uppercase tracking-widest"
                >
                  Start New Scan
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
