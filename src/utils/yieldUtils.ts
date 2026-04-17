/**
 * KrishiAI Yield Forecasting Engine
 * 
 * This utility calculates dynamic growth and yield metrics based on 
 * historical farm data and simulated environmental factors.
 */

export interface YieldMetrics {
  maturity: number;         // 0-100 percentage
  daysLeft: number;         // Days until estimated harvest
  yieldPotential: number;    // 0-100 percentage
  nutrientHealth: number;    // 0-100 percentage
  waterConsistency: number;  // 0-100 percentage
  pestRisk: number;          // 0-100 percentage (Lower is better)
  growthRate: "Optimal" | "Normal" | "Stunted" | "Accelerated";
  weatherImpact: {
    factor: string;
    description: string;
    severity: "low" | "medium" | "high";
  };
}

export function calculateYieldMetrics(profile: any): YieldMetrics {
  const now = new Date();
  const seeding = new Date(profile.seedingDate);
  const harvest = new Date(profile.harvestDate);
  
  // 1. Maturity Calculation
  const totalGrowthDuration = harvest.getTime() - seeding.getTime();
  const timeElapsed = now.getTime() - seeding.getTime();
  const maturity = Math.min(100, Math.max(0, Math.round((timeElapsed / totalGrowthDuration) * 100)));
  const daysLeft = Math.max(0, Math.ceil((harvest.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  // 2. Water Consistency (Decays based on days since last watered)
  const daysSinceWatered = Math.floor((now.getTime() - new Date(profile.lastWateredDate).getTime()) / (1000 * 60 * 60 * 24));
  let waterConsistency = 100 - (daysSinceWatered * 12); // Decays 12% per day missed
  waterConsistency = Math.max(10, Math.min(100, waterConsistency));

  // 3. Nutrient Health (Decays based on days since last fertilized)
  const daysSinceFertilized = Math.floor((now.getTime() - new Date(profile.lastFertilizedDate).getTime()) / (1000 * 60 * 60 * 24));
  let nutrientHealth = 95 - (Math.max(0, daysSinceFertilized - 14) * 2); // Starts decaying after 2 weeks
  nutrientHealth = Math.max(20, Math.min(100, nutrientHealth));

  // 4. Weather Simulation (Location-aware)
  let weatherImpactMod = 0;
  let weatherFactor = "Ideal";
  let weatherDesc = "Clear skies and optimal temperature for growth.";
  let severity: "low" | "medium" | "high" = "low";

  // Mocked location patterns
  if (profile.location?.toLowerCase().includes("punjab") || profile.location?.toLowerCase().includes("haryana")) {
    // Simulate a dry heatwave for Northern India
    weatherFactor = "Heatwave Warning";
    weatherDesc = "High temperatures detected. Increased evaporation risk.";
    weatherImpactMod = -8;
    severity = "medium";
  } else if (profile.location?.toLowerCase().includes("kerala") || profile.location?.toLowerCase().includes("maharashtra")) {
    // Simulate high humidity/monsoon risk
    weatherFactor = "High Humidity";
    weatherDesc = "Fungal risk increased due to moisture saturation.";
    weatherImpactMod = -5;
    severity = "low";
  }

  // 5. Final Yield Potential calculation
  // Base 100, affected by water, nutrients, and weather
  let potential = (waterConsistency * 0.4) + (nutrientHealth * 0.4) + (100 + weatherImpactMod) * 0.2;
  
  // Growth Rate determined by conditions
  let growthRate: YieldMetrics["growthRate"] = "Normal";
  if (potential > 90) growthRate = "Optimal";
  if (potential < 70) growthRate = "Stunted";
  if (growthRate === "Normal" && maturity > 80) growthRate = "Accelerated"; // Final spurt

  return {
    maturity,
    daysLeft,
    yieldPotential: Math.round(potential),
    nutrientHealth: Math.round(nutrientHealth),
    waterConsistency: Math.round(waterConsistency),
    pestRisk: 12 + (daysSinceWatered > 5 ? 15 : 0), // Simple pest logic
    growthRate,
    weatherImpact: {
      factor: weatherFactor,
      description: weatherDesc,
      severity
    }
  };
}
