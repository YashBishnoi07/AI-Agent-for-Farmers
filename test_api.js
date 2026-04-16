async function testSarvam() {
  const SARVAM_API_KEY = "sk_4t6lxggc_Vwq0UbT85DDihUVf05tyehJI"; // The key you provided
  try {
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: JSON.stringify({
        model: "sarvam-30b",
        messages: [{ role: "user", content: "Hello" }],
      }),
    });
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Raw Response:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}
testSarvam();
