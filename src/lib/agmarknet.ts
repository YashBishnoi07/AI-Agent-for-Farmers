export interface MandiPrice {
  commodity: string;
  market: string;
  district: string;
  state: string;
  max_price: number;
  min_price: number;
  modal_price: number;
  date: string;
}

export async function fetchMandiPrices(commodity: string, state?: string): Promise<MandiPrice[]> {
  try {
    // Note: CEDA API endpoints might require specific payload structures.
    // This is a simplified fetcher using the Ashoka University CEDA API structure.
    const response = await fetch("https://api.ceda.ashoka.edu.in/v1/agmarknet/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commodity: commodity,
        state: state || "All",
        limit: 5
      }),
    });

    if (!response.ok) throw new Error("Mandi API Error");
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to fetch mandi prices:", error);
    return [];
  }
}

// Mock data for initial development/fallback
export const MOCK_PRICES: MandiPrice[] = [
  {
    commodity: "Wheat",
    market: "Khanna",
    district: "Ludhiana",
    state: "Punjab",
    min_price: 2100,
    max_price: 2450,
    modal_price: 2275,
    date: new Date().toISOString()
  },
  {
    commodity: "Onion",
    market: "Lasalgaon",
    district: "Nashik",
    state: "Maharashtra",
    min_price: 1500,
    max_price: 1800,
    modal_price: 1650,
    date: new Date().toISOString()
  }
];
