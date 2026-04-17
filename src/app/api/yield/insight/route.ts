import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { profile, metrics } = await req.json();

    const prompt = `
      You are KrishiAI, an expert agricultural scientist. 
      Analyze the following crop data and provide 2-3 specific, actionable suggestions.
      
      User Profile:
      - Name: ${profile.name}
      - Location: ${profile.location}
      - Crop: ${profile.cropType}
      - Soil Type: ${profile.soilType}
      
      Current Metrics:
      - Maturity: ${metrics.maturity}%
      - Yield Potential: ${metrics.yieldPotential}%
      - Nutrient Health: ${metrics.nutrientHealth}%
      - Water Consistency: ${metrics.waterConsistency}%
      - Growth Rate: ${metrics.growthRate}
      - Weather Impact: ${metrics.weatherImpact.factor} (${metrics.weatherImpact.description})
      
      Requirements:
      1. Provide the response ONLY in this language: ${profile.language || "English"}.
      2. Keep it professional, encouraging, and highly specific to the data.
      3. Focus on what to do next to maximize yield.
      
      Format: A professional paragraph of advice.
    `;

    // Attempt to connect to local Ollama
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2", // Defaulting to 3.2 for quality, falls back if not found
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama connection failed: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ insight: data.response });

  } catch (error: any) {
    console.error("Yield Insight Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI insights. Ensure Ollama is running locally." },
      { status: 500 }
    );
  }
}
