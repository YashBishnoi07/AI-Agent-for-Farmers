const fs = require('fs');

async function testTTS() {
    const API_KEY = "sk_4t6lxggc_Vwq0UbT85DDihUVf05tyehJI";
    const URL = "https://api.sarvam.ai/text-to-speech";

    const payload = {
        text: "Namaste, main aapki Krishi Mitra hoon.",
        language_code: "hi-IN",
        voice: "hi-IN-Female-1", 
        speech_sample_rate: 22050
    };

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": API_KEY
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("STATUS:", response.status);
        if (data.audio_content) {
            console.log("SUCCESS: Audio content found (length: " + data.audio_content.length + ")");
        } else {
            console.log("ERROR_DATA:", JSON.stringify(data).substring(0, 500));
        }
    } catch (error) {
        console.log("FETCH_ERROR:", error.message);
    }
}

testTTS();
