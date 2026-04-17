/**
 * KrishiAI Hybrid AI Service
 * 
 * This service handles communication with AI providers, automatically 
 * switching between local (Ollama) and cloud (Sarvam/Groq) based on 
 * network connectivity.
 */

export interface AIResponse {
  text: string;
  isOffline: boolean;
  error?: string;
}

const CLOUD_API_URL = "/api/chat"; // Proxied through Next.js API in web, or server URL in mobile
const LOCAL_API_URL = "http://localhost:11434/api/generate";

export class AIService {
  /**
   * Generates a chat response using a hybrid approach
   */
  static async getChatResponse(messages: any[], profile: any): Promise<AIResponse> {
    const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

    if (isOnline) {
      try {
        // In mobile/static export, /api/chat won't exist. 
        // We fallback to local or a hardcoded cloud endpoint in the future.
        const response = await fetch(CLOUD_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, userProfile: profile }),
        });
        
        if (response.ok) {
          const data = await response.json();
          return { text: data.text, isOffline: false };
        }
      } catch (e) {
        console.warn("Cloud AI failed, falling back to local...", e);
      }
    }

    // Offline / Local Fallback
    return this.getLocalResponse(messages, profile);
  }

  /**
   * Calls a local Ollama instance
   */
  private static async getLocalResponse(messages: any[], profile: any): Promise<AIResponse> {
    try {
      const lastMessage = messages[messages.length - 1].content;
      const prompt = `
        You are KrishiAI (Offline Mode). 
        Address the user as ${profile.name || "Farmer"}.
        Language: ${profile.language || "English"}.
        Context: The user is asking about ${profile.cropType || "their crops"}.
        
        Question: ${lastMessage}
      `;

      const response = await fetch(LOCAL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          prompt: prompt,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error("Local AI not responding");

      const data = await response.json();
      return { text: data.response, isOffline: true };
    } catch (e) {
      return { 
        text: "I am currently offline and cannot connect to your local AI engine. Please ensure Ollama is running.", 
        isOffline: true,
        error: "LOCAL_AI_UNAVAILABLE"
      };
    }
  }

  /**
   * Static analysis for Yield forecasting
   */
  static async getYieldInsight(profile: any, metrics: any): Promise<AIResponse> {
    const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

    // For now, we reuse the pattern: try Cloud API, then fallback to Local
    try {
      const endpoint = isOnline ? "/api/yield/insight" : LOCAL_API_URL;
      
      if (isOnline) {
        const response = await fetch("/api/yield/insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile, metrics }),
        });
        const data = await response.json();
        return { text: data.insight, isOffline: false };
      } else {
        return this.getLocalYieldInsight(profile, metrics);
      }
    } catch (e) {
      return this.getLocalYieldInsight(profile, metrics);
    }
  }

  private static async getLocalYieldInsight(profile: any, metrics: any): Promise<AIResponse> {
    try {
      const prompt = `Yield Forecast Analysis for ${profile.cropType}. Maturity: ${metrics.maturity}%. Potential: ${metrics.yieldPotential}%. Provide advice in ${profile.language}.`;
      
      const response = await fetch(LOCAL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          prompt: prompt,
          stream: false,
        }),
      });
      const data = await response.json();
      return { text: data.response, isOffline: true };
    } catch (e) {
      return { text: "Yield advice is unavailable offline without Ollama.", isOffline: true };
    }
  }
}
