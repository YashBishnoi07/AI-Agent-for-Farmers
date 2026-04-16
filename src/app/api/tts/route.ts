import { NextResponse } from "next/server";

const SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech";
const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { text, languageCode } = await req.json();

    if (!SARVAM_API_KEY) {
      return NextResponse.json({ error: "SARVAM_API_KEY not found" }, { status: 500 });
    }

    // Default to a high-quality warm female voice
    const selectedLanguage = languageCode || "hi-IN";
    
    // Dynamically select the voice ID based on the language code
    // Sarvam voices follow the pattern [lang-code]-Female-1
    const voiceId = `${selectedLanguage.split('-')[0]}-${selectedLanguage.split('-')[1]}-Female-1`;

    const response = await fetch(SARVAM_TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: JSON.stringify({
        text,
        language_code: selectedLanguage,
        voice: voiceId, 
        speech_sample_rate: 22050,
        pace: 0.85, 
        target_uniform_output: true 
      }),
    });

    const data = await response.json();

    if (data.audios && data.audios.length > 0) {
      return NextResponse.json({ audio: data.audios[0] });
    } else {
      console.error("Sarvam TTS Error:", data);
      return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
    }
  } catch (error) {
    console.error("TTS API Route Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
