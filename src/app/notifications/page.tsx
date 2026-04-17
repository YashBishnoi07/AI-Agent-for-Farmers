"use client";

import { motion } from "framer-motion";
import { 
  Bell, 
  ChevronLeft, 
  CloudRain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Info,
  Droplets,
  Sprout
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const INITIAL_NOTIFICATIONS = [
  { 
    id: 5, 
    type: "irrigation", 
    title: "Time to Water", 
    desc: "Soil moisture is at 28%. Water your Wheat crop today to prevent heat stress.", 
    time: "Just now",
    icon: Droplets,
    color: "bg-cyan-50 text-cyan-600",
    urgent: true
  },
  { 
    id: 6, 
    type: "yield", 
    title: "Yield Milestone: 75%", 
    desc: "Your Wheat crop has reached the grain-filling stage. Potential yield is currently estimated at 4.2 Tons/Acre.", 
    time: "1 hour ago",
    icon: Sprout,
    color: "bg-emerald-50 text-emerald-600",
    urgent: false
  },
  { 
    id: 1, 
    type: "weather", 
    title: "Heavy Rain Warning", 
    desc: "Unexpected rain expected in Delhi NCR. Cover your harvested crops.", 
    time: "2 hours ago",
    icon: CloudRain,
    color: "bg-blue-50 text-blue-600",
    urgent: true
  },
  { 
    id: 2, 
    type: "market", 
    title: "Price Alert: Wheat", 
    desc: "Wheat prices at Azadpur Mandi increased by ₹150/qtl. Best time to sell.", 
    time: "5 hours ago",
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600",
    urgent: false
  },
  { 
    id: 3, 
    type: "vision", 
    title: "Diagnosis Complete", 
    desc: "Your Tomato leaf scan shows Early Blight symptoms. View organic remedy.", 
    time: "Yesterday",
    icon: AlertTriangle,
    color: "bg-amber-50 text-amber-600",
    urgent: false
  },
  { 
    id: 4, 
    type: "system", 
    title: "Profile Updated", 
    desc: "Your preferred language has been changed to Punjabi.", 
    time: "2 days ago",
    icon: CheckCircle2,
    color: "bg-zinc-50 text-zinc-600",
    urgent: false
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf8] p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-white rounded-full shadow-sm border border-emerald-50 text-emerald-800">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-emerald-950 tracking-tight">Updates</h1>
            <p className="text-[10px] text-emerald-600/60 uppercase tracking-widest font-bold">Inbox</p>
          </div>
        </div>
        <button 
          onClick={() => setNotifications([])}
          className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-200">
              <Bell size={40} />
            </div>
            <p className="text-emerald-800/40 font-bold uppercase tracking-widest text-[10px]">Your inbox is clean</p>
          </div>
        ) : (
          notifications.map((n, idx) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-5 rounded-[32px] bg-white border border-emerald-50 shadow-sm relative overflow-hidden group ${n.urgent ? 'ring-2 ring-red-500/10' : ''}`}
            >
              {n.urgent && (
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
              )}
              
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                  <n.icon size={24} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-black text-emerald-950">{n.title}</h4>
                    <span className="text-[9px] font-bold text-emerald-800/20 uppercase whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-xs text-emerald-800/60 leading-relaxed font-medium">{n.desc}</p>
                  
                  <div className="flex gap-3 pt-3">
                    <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 group/btn">
                      View Details <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => deleteNotification(n.id)}
                      className="text-[10px] font-black text-red-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pro Tip */}
      <div className="mt-12 bg-emerald-950 rounded-[32px] p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full -mr-12 -mt-12 blur-2xl" />
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center text-emerald-300">
            <Info size={20} />
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Pro Tip</h5>
            <p className="text-xs font-medium text-emerald-100">Keep notifications enabled to get live price spikes for your crops.</p>
          </div>
        </div>
      </div>
    </div>
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
