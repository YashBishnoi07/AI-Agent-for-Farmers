"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sprout, 
  MapPin, 
  User, 
  Maximize2, 
  ArrowRight,
  Languages
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, Language } from "@/context/UserContext";

const LANGUAGES = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
  { id: "pa", name: "Punjabi" },
  { id: "mr", name: "Marathi" },
  { id: "te", name: "తెలుగు" },
  { id: "ta", name: "தமிழ்" }
];

export default function OnboardingPage() {
  const { profile, updateProfile, dictionary, loading } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: profile.name,
    cropType: profile.cropType,
    location: profile.location,
    farmSize: profile.farmSize
  });

  const handleStart = () => {
    updateProfile({ ...formData, isOnboarded: true });
    router.push("/");
  };

  if (loading || !dictionary) return (
    <div className="min-h-screen bg-[#f8faf8] flex items-center justify-center text-emerald-600">
      <Sprout size={48} className="animate-bounce" />
    </div>
  );

  const t = dictionary.onboarding;

  return (
    <div className="min-h-screen bg-[#f8faf8] flex flex-col items-center">
      {/* Header Banner */}
      <div className="w-full max-w-md bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 pt-12 pb-16 text-center text-white relative overflow-hidden shadow-xl rounded-b-[40px]">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Sprout size={200} className="absolute -bottom-10 -right-10 rotate-12" />
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-black mb-3 tracking-tight">{t.title}</h1>
          <p className="text-emerald-50/80 text-sm leading-relaxed max-w-[240px] mx-auto font-medium">
            {t.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md px-6 -mt-8 pb-12 space-y-8">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-[40px] p-8 shadow-2xl shadow-emerald-900/5 border border-emerald-50"
        >
          {/* Language Selection */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <h2 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.2em]">{t.choose_language}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => updateProfile({ language: lang.id as Language })}
                  className={`py-4 px-4 rounded-2xl text-sm font-black transition-all border-2 ${
                    profile.language === lang.id 
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20 scale-[1.02]" 
                      : "bg-white text-emerald-900/40 border-emerald-50 hover:border-emerald-200"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-emerald-50 my-10 w-full" />

          {/* Profile Form */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <h2 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.2em]">{t.your_profile}</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-800/40 uppercase ml-1 tracking-widest">{t.crop_type}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/30">
                    <Sprout size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. Wheat"
                    value={formData.cropType}
                    onChange={(e) => setFormData({...formData, cropType: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-emerald-50/30 border border-emerald-100 rounded-3xl text-sm font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-emerald-800/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-800/40 uppercase ml-1 tracking-widest">{t.location}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/30">
                    <MapPin size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Hisar, Haryana"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-emerald-50/30 border border-emerald-100 rounded-3xl text-sm font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-emerald-800/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-800/40 uppercase ml-1 tracking-widest">{t.farm_size}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/30">
                    <Maximize2 size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. 2.5"
                    value={formData.farmSize}
                    onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-emerald-50/30 border border-emerald-100 rounded-3xl text-sm font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-emerald-800/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-800/40 uppercase ml-1 tracking-widest">{t.your_name}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/30">
                    <User size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-emerald-50/30 border border-emerald-100 rounded-3xl text-sm font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-emerald-800/20"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleStart}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 mt-10 transition-all active:scale-[0.98]"
            >
              🚀 {t.button_start} <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
