import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const VISION_PROMPT = `
You are an expert plant pathologist. 
The user has provided an image of a crop or plant.
Please provide your analysis in the following STRUCTURED format:

[CONFIDENCE]: (0-100%)
[DIAGNOSIS]: (Summarize what is wrong)
[SYMPTOMS]: (List visible signs)
[ORGANIC_REMEDY]: (Best natural solution)
[CHEMICAL_REMEDY]: (If necessary, the best chemical solution)
[PREVENTION]: (How to stop this next time)
[EXPERT_TIP]: (One professional pearl of wisdom)

Keep the advice practical for a small-scale farmer. 
If the image doesn't show a plant, politely ask the user to provide a clear photo of the crop part they are worried about.
`;

export async function POST(req: Request) {
  try {
    const { image } = await req.json(); // base64 image data
    
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Call Groq Llama 3.2 Vision
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: VISION_PROMPT },
              {
                type: "image_url",
                image_url: {
                  url: image // data:image/jpeg;base64,...
                }
              }
            ]
          }
        ],
        temperature: 0.1, // Lower temperature for more accurate diagnosis
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Groq API Error");
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Groq Vision API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze image. Ensure your Groq API key is valid." },
      { status: 500 }
    );
  }
}
