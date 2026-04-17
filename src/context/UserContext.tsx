"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi" | "pa" | "mr" | "te" | "ta";

interface UserProfile {
  name: string;
  language: Language;
  cropType: string;
  location: string;
  farmSize: string;
  soilType: string;
  lastWateredDate: string;
  seedingDate: string;
  harvestDate: string;
  targetYield: number;
  lastFertilizedDate: string;
  isOnboarded: boolean;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  dictionary: any;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  hi: () => import("@/dictionaries/hi.json").then((m) => m.default),
  pa: () => import("@/dictionaries/pa.json").then((m) => m.default),
  mr: () => import("@/dictionaries/mr.json").then((m) => m.default),
  te: () => import("@/dictionaries/te.json").then((m) => m.default),
  ta: () => import("@/dictionaries/ta.json").then((m) => m.default),
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    language: "en",
    cropType: "",
    location: "",
    farmSize: "",
    soilType: "Loam",
    lastWateredDate: new Date().toISOString(),
    seedingDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago for demo
    harvestDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(), // 75 days to go
    targetYield: 4.5,
    lastFertilizedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isOnboarded: false,
  });
  const [dictionary, setDictionary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("agribot_user_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("agribot_user_profile", JSON.stringify(profile));
  }, [profile]);

  // Load Dictionary
  useEffect(() => {
    const loadDict = async () => {
      setLoading(true);
      try {
        const lang = profile.language as keyof typeof dictionaries;
        const dict = dictionaries[lang] ? await dictionaries[lang]() : await dictionaries.en();
        setDictionary(dict);
      } catch (err) {
        console.error("Failed to load dictionary", err);
      } finally {
        setLoading(false);
      }
    };
    loadDict();
  }, [profile.language]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, dictionary, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
