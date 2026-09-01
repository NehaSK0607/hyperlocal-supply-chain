"use client";

import React, { useState, useEffect } from 'react';

interface Zone {
  zoneId: string;
  zoneName: string;
  latitude: number;
  longitude: number;
}

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
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState("HYD_ZONE_MADHAPUR");
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dynamic PostGIS zones on load
  useEffect(() => {
    fetch("http://localhost:8080/api/zones")
      .then((res) => res.json())
      .then((data) => setZones(data))
      .catch((err) => console.error("Failed to fetch zones:", err));
  }, []);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/forecast/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zoneId: selectedZone,
          skuId: 1,
          currentDemand: 120
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

  const currentZoneObj = zones.find(z => z.zoneId === selectedZone);

  return (
    <div className="p-8 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 max-w-xl w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-emerald-400 tracking-wide">HYPERLOCAL COMMAND CENTER</h2>
          <p className="text-xs text-slate-400">PostGIS Spatial Engine & ML Demand Forecasting</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full animate-pulse">
          LIVE SYSTEM
        </span>
      </div>

      {/* Zone Selector (Pulled from PostgreSQL PostGIS) */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Select Dark Store Zone (PostGIS DB)
        </label>
        <select 
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
        >
          {zones.map((zone) => (
            <option key={zone.zoneId} value={zone.zoneId}>
              {zone.zoneName} ({zone.zoneId})
            </option>
          ))}
        </select>
        {currentZoneObj && (
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            GPS Coordinates: Lat {currentZoneObj.latitude}, Lon {currentZoneObj.longitude} (SRID: 4326)
          </p>
        )}
      </div>
      
      <button 
        onClick={fetchForecast}
        disabled={loading}
        className="w-full px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg shadow-emerald-900/40 disabled:opacity-50 mb-6"
      >
        {loading ? "Analyzing Telemetry Stream..." : "Run AI Surge Forecast & Warehouse Check"}
      </button>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {forecast && (
        <div className="space-y-4 border-t border-slate-800 pt-6 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-1">Current Order Load</span>
              <span className="text-xl font-bold text-white">{forecast.currentDemand} <span className="text-xs font-normal text-slate-400">units/hr</span></span>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-1">Predicted Load (2 hrs)</span>
              <span className="text-xl font-bold text-amber-400">{forecast.forecastedDemand} <span className="text-xs font-normal text-slate-400">units/hr</span></span>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-950/40 px-4 py-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs uppercase font-semibold">Predicted Spike Magnitude</span>
            <span className="text-red-400 font-black text-base">+{forecast.surgePercentage}%</span>
          </div>

          {/* Warehouse Alignment & Action Trigger */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Local Warehouse Stock:</span>
              <span className="font-semibold text-emerald-400">Optimal (Sufficient)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Main Hub Sync Status:</span>
              <span className="font-semibold text-cyan-400">Linked to Central Hub</span>
            </div>
            <div className="pt-2 border-t border-slate-900 mt-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Automated Action Protocol:</p>
              <p className="font-mono text-xs text-emerald-300 font-bold bg-emerald-950/40 px-3 py-2 rounded border border-emerald-900/50">
                {forecast.recommendedAction}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
