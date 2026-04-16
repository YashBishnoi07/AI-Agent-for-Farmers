import { NextResponse } from "next/server";
import { fetchMandiPrices, MOCK_PRICES } from "@/lib/agmarknet";

const SARVAM_API_URL = "https://api.sarvam.ai/v1/chat/completions";
const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";

const SYSTEM_PROMPT = `You are "Krishi Mitra", a warm, empathetic, and wise agricultural expert who helps small-scale Indian farmers. 

Rules for Interaction:
1. PERSONA: Speak like a helpful expert friend or a village elder. Use warm, encouraging language. Avoid being robotic. Avoid using bullet points unless explicitly asked for a list; try to speak in natural paragraphs.
2. BREVITY: Keep your initial responses short, direct, and practical (maximum 3-4 sentences). Only give detailed explanations if the user asks "Tell me more" or "Explain in detail".
3. STRICT SCRIPT: ALWAYS respond in the user's preferred language using PROPER NATIVE SCRIPT ONLY. 
   - If the conversation is in Hindi, use ONLY Devanagari script for EVERY WORD. 
   - DO NOT use English/Latin letters for words like "Kheti", "Mandi", "Fasal", or "Kisan". 
   - ONLY use Latin letters for specific technical units like "kg", "quintal", or "pH".
   - AVOID Hinglish or mixed-script writing.
5. EXPERTISE: Focus on sustainable farming, organic solutions, pest control, and market trends. Use the provided Mandi context if available.
`;

export async function POST(req: Request) {
  try {
    const { messages, userProfile } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content.toLowerCase();

    const langMap: { [key: string]: string } = {
      "hi": "Hindi (Devanagari script)",
      "pa": "Punjabi (Gurmukhi script)",
      "mr": "Marathi (Devanagari script)",
      "te": "Telugu (Telugu script)",
      "ta": "Tamil (Tamil script)",
      "en": "English (Latin script)"
    };

    const userLanguageCode = userProfile?.language || "hi";
    const userLanguageFull = langMap[userLanguageCode] || "Hindi (Devanagari script)";

    const userContextStr = userProfile ? `
User Profile:
- Name: ${userProfile.name}
- Main Crop: ${userProfile.cropType}
- Location: ${userProfile.location}
- Farm Size: ${userProfile.farmSize}
- Preferred Language: ${userLanguageFull}

Always address the user by name if appropriate. Prioritize advice relevant to their specific crop and location. 
CRITICAL: You MUST write your response in ${userLanguageFull}. Do not use any other Indian language script.
` : "";

    // Enhanced commodity detection with regional mapping
    const commodityMap: { [key: string]: string[] } = {
      "Onion": ["onion", "kanda", "pyaj", "pyaaj", "kandhe"],
      "Potato": ["potato", "aloo", "batata", "alu"],
      "Tomato": ["tomato", "tamatar", "tamatari"],
      "Wheat": ["wheat", "gehu", "gehun", "kanak"],
      "Rice": ["rice", "chawal", "dhan", "paddy"],
      "Cotton": ["cotton", "kapas", "rui"]
    };

    let found = "";
    Object.entries(commodityMap).forEach(([key, synonyms]) => {
      if (synonyms.some(s => lastUserMessage.toLowerCase().includes(s))) {
        found = key;
      }
    });
    
    let marketContext = "";
    if (found) {
      const prices = await fetchMandiPrices(found);
      const dataToUse = prices.length > 0 ? prices : MOCK_PRICES.filter(p => p.commodity.toLowerCase() === found.toLowerCase());
      
      if (dataToUse.length > 0) {
        marketContext = `\n\n[LIVE MANDI DATA DETECTED]\nReal-time prices for ${found} from Agmarknet. USE THESE LIVE PRICES in your response:\n` + 
          dataToUse.map(p => `- Market: ${p.market} (${p.state}), Price: ₹${p.modal_price}/quintal`).join("\n");
      }
    }

    // Call Sarvam AI
    const response = await fetch(SARVAM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: JSON.stringify({
        model: "sarvam-30b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + userContextStr + (marketContext ? `\n\n${marketContext}` : "") },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Sarvam API Error");
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return NextResponse.json({ text, marketData: marketContext ? found : null });
  } catch (error: any) {
    console.error("Sarvam AI Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response. Please check your Sarvam API key." },
      { status: 500 }
    );
  }
}
