"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  ChevronLeft, 
  Mic, 
  Image as ImageIcon, 
  MoreVertical,
  Bot,
  User,
  Volume2,
  Paperclip
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AgriBot assistant. How can I help you with your crops today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { profile, dictionary } = useUser();

  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = async (text: string, msgId: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      setIsPlayingId(msgId);
      
      const langCodes: { [key: string]: string } = {
        hi: "hi-IN",
        en: "en-IN",
        pa: "pa-IN",
        mr: "mr-IN",
        te: "te-IN",
        ta: "ta-IN"
      };

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text, 
          languageCode: langCodes[profile.language] || "hi-IN" 
        }),
      });
      
      const data = await response.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audioRef.current = audio;
        audio.onended = () => setIsPlayingId(null);
        audio.onerror = () => setIsPlayingId(null);
        audio.play();
      } else {
        setIsPlayingId(null);
      }
    } catch (error) {
      console.error("TTS Fetch Error:", error);
      setIsPlayingId(null);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = profile.language === "hi" ? "hi-IN" : "en-IN";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          userProfile: profile 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8faf8]">
      {/* Header */}
      <div className="p-4 bg-white/80 backdrop-blur-md flex items-center justify-between border-b border-emerald-100 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-emerald-800" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center border border-emerald-200">
              <Bot size={24} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-sm font-black text-emerald-950 uppercase tracking-tight">{dictionary?.chat?.title || "AgriBot Assistant"}</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-emerald-600/60 font-bold uppercase tracking-widest">Always Active</span>
              </div>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-emerald-50 rounded-full text-emerald-800/40">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-24"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === "user" ? "bg-emerald-600 text-white" : "bg-white text-emerald-600 border border-emerald-100"
                }`}>
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="space-y-1">
                  <div className={`p-4 rounded-[20px] text-sm leading-relaxed shadow-sm relative group ${
                    msg.role === "user" 
                      ? "bg-emerald-600 text-white rounded-tr-none" 
                      : "bg-white text-emerald-950 rounded-tl-none border border-emerald-50"
                  }`}>
                    {msg.content}
                    {msg.role === "assistant" && (
                      <div className="flex justify-end mt-3 pt-3 border-t border-emerald-50">
                        <button 
                          onClick={() => speakText(msg.content, msg.id)}
                          disabled={isPlayingId === msg.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all active:scale-95 ${
                            isPlayingId === msg.id 
                            ? "bg-emerald-100 text-emerald-800 animate-pulse" 
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          <Volume2 size={14} /> 
                          {isPlayingId === msg.id ? "Reading..." : "Listen Advice"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={`text-[9px] font-bold uppercase tracking-widest text-emerald-800/30 ${msg.role === "user" ? "text-right mr-1" : "ml-1"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none flex gap-1 items-center border border-emerald-50 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-[#f8faf8] via-[#f8faf8] to-transparent z-10">
        <div className="bg-white flex items-center gap-2 p-2 pl-4 pr-2 rounded-[24px] shadow-xl shadow-emerald-900/5 border border-emerald-100 ring-1 ring-emerald-500/5">
          <button className="p-2 text-emerald-800/30 hover:text-emerald-500 transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={dictionary?.chat?.placeholder || "Ask anything about your farm..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 placeholder:text-emerald-800/20 text-emerald-950 font-medium"
          />
          <div className="flex gap-1.5">
            <button 
              onClick={handleVoiceInput}
              className={`p-3 rounded-2xl transition-all ${
                isListening ? "bg-red-500 text-white animate-pulse" : "text-emerald-800/30 hover:text-emerald-500 bg-emerald-50/50"
              }`}
            >
              <Mic size={20} />
            </button>
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-500/20 disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <Send size={18} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
