"use client";

import React, { useState } from 'react';

interface ForecastData {
  zoneId: string;
  skuId: number;
  currentDemand: number;
  forecastedDemand: number;
  surgePercentage: number;
  riskLevel: string;
  recommendedAction: string;
}

export default function SurgeForecastCard() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/forecast/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zoneId: "HYD_ZONE_MADHAPUR",
          skuId: 1,
          currentDemand: 100
        }),
      });
      
      if (!res.ok) throw new Error("Failed to fetch forecast");
      
      const data = await res.json();
      setForecast(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800 max-w-md">
      <h2 className="text-xl font-bold text-emerald-400 mb-4">Demand Surge Forecast</h2>
      
      <button 
        onClick={fetchForecast}
        disabled={loading}
        className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold transition-all mb-4 disabled:opacity-50"
      >
        {loading ? "Analyzing Stream Data..." : "Run Real-time Forecast"}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {forecast && (
        <div className="mt-4 space-y-2 border-t border-slate-800 pt-4 text-sm">
          <p><span className="text-slate-400">Target Zone:</span> <strong>{forecast.zoneId}</strong></p>
          <p><span className="text-slate-400">Current Order Load:</span> {forecast.currentDemand} units/hr</p>
          <p><span className="text-slate-400">Predicted Load (2 hrs):</span> <strong className="text-amber-400">{forecast.forecastedDemand} units/hr</strong></p>
          <p><span className="text-slate-400">Predicted Spike:</span> <strong className="text-red-400">+{forecast.surgePercentage}%</strong></p>
          
          <div className="mt-4 p-3 bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">System Action Trigger:</p>
            <p className="font-mono text-xs text-emerald-300 font-semibold">{forecast.recommendedAction}</p>
          </div>
        </div>
      )}
    </div>
  );
}
