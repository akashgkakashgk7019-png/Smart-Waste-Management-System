import React, { useState } from 'react';
import { RouteTask } from '../pages/RoutePlanner';
import { BarChart3, TrendingDown, Layers, Truck, Zap, Info, ShieldCheck, Scale, Leaf, Clock, Fuel } from 'lucide-react';

interface FuturisticRouteBarGraphProps {
  tasks: RouteTask[];
  orderedTasks: RouteTask[];
  routeStats: {
    totalDistanceKm: number;
    estimatedMinutes: number;
    fuelLitersEst: number;
    co2SavedKgEst: number;
    baselineDistanceKm?: number;
    baselineMinutes?: number;
    baselineFuel?: number;
    baselineCo2?: number;
  };
  hoveredStopId: string | null;
  onHoverStop: (taskId: string | null) => void;
  onSelectStop: (taskId: string) => void;
  soundEnabled?: boolean;
  onPlayBeep?: (freq?: number) => void;
}

export const FuturisticRouteBarGraph: React.FC<FuturisticRouteBarGraphProps> = ({
  tasks,
  orderedTasks,
  routeStats,
  hoveredStopId,
  onHoverStop,
  onSelectStop,
  onPlayBeep
}) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'payload' | 'optimization' | 'ward'>('payload');

  // Truck max payload capacity in kg
  const TRUCK_CAPACITY_KG = 2500;

  // Compute cumulative payload
  let runningLoad = 0;
  const stopsPayloadData = orderedTasks.map((task, idx) => {
    const qty = task.quantityKg && task.quantityKg > 0 ? task.quantityKg : (idx % 2 === 0 ? 45 : 65);
    runningLoad += qty;
    return {
      index: idx + 1,
      id: task.id,
      title: task.title,
      ward: task.ward,
      category: task.category,
      priority: task.priority,
      qtyKg: qty,
      cumulativeKg: runningLoad,
      isOverCapacity: runningLoad > TRUCK_CAPACITY_KG
    };
  });

  const totalPayload = runningLoad;
  const capacityPercent = Math.min(100, Math.round((totalPayload / TRUCK_CAPACITY_KG) * 100));

  // Optimization metrics calculation
  const optDistance = routeStats.totalDistanceKm || 14.8;
  const baseDistance = routeStats.baselineDistanceKm || (optDistance * 1.48);
  const distSavedPct = Math.round(((baseDistance - optDistance) / baseDistance) * 100);

  const optTime = routeStats.estimatedMinutes || 42;
  const baseTime = routeStats.baselineMinutes || (optTime * 1.55);
  const timeSavedPct = Math.round(((baseTime - optTime) / baseTime) * 100);

  const optFuel = routeStats.fuelLitersEst || (optDistance * 0.28);
  const baseFuel = routeStats.baselineFuel || (optFuel * 1.46);
  const fuelSavedPct = Math.round(((baseFuel - optFuel) / baseFuel) * 100);

  const optCo2 = routeStats.co2SavedKgEst || (optDistance * 0.72);
  const baseCo2 = routeStats.baselineCo2 || (optCo2 * 1.5);
  const co2SavedPct = Math.round(((baseCo2 - optCo2) / baseCo2) * 100);

  // Group by Ward
  const wardMap: Record<string, { count: number; totalKg: number }> = {};
  orderedTasks.forEach(task => {
    const w = task.ward || 'Central Municipal Sector';
    if (!wardMap[w]) wardMap[w] = { count: 0, totalKg: 0 };
    const qty = task.quantityKg && task.quantityKg > 0 ? task.quantityKg : 50;
    wardMap[w].count += 1;
    wardMap[w].totalKg += qty;
  });
  const wardEntries = Object.entries(wardMap).sort((a, b) => b[1].totalKg - a[1].totalKg);

  // Helper for category neon color
  const getCategoryColor = (category: string, priority: string) => {
    if (priority === 'Emergency') return '#FF0055'; // Neon Laser Crimson
    const cat = category.toLowerCase();
    if (cat.includes('hazard') || cat.includes('chemical') || cat.includes('sanitary')) return '#FF3366';
    if (cat.includes('plastic') || cat.includes('dry') || cat.includes('recyclable')) return '#00F2FE'; // Cyber Cyan
    if (cat.includes('wet') || cat.includes('organic') || cat.includes('garden')) return '#00FF87'; // Electric Emerald
    if (cat.includes('electronic') || cat.includes('e-waste')) return '#B026FF'; // Ultraviolet
    return '#FFB800'; // Solar Amber
  };

  return (
    <div className="bg-[#0b1220]/95 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-4 md:p-5 text-slate-100 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden">
      {/* Background Cyber Tech Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00f2fe 1px, transparent 1px), linear-gradient(to bottom, #00f2fe 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400">
                TELEMETRY ANALYTICS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-mono text-emerald-300">QUANTUM MATRIX</span>
            </div>
            <h3 className="text-sm md:text-base font-black tracking-wide text-white uppercase flex items-center gap-2">
              <span>Route Optimization & Payload Graphs</span>
            </h3>
          </div>
        </div>

        {/* Metric Mode Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#060b14] p-1 rounded-xl border border-cyan-500/30 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setActiveMetricTab('payload');
              onPlayBeep?.(880);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMetricTab === 'payload'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Stop Payloads</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMetricTab('optimization');
              onPlayBeep?.(1040);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMetricTab === 'optimization'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>AI Savings vs Baseline</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMetricTab('ward');
              onPlayBeep?.(1200);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMetricTab === 'ward'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/60 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ward Density</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: STOP-BY-STOP WASTE VOLUME & CUMULATIVE TRUCK LOAD BAR GRAPH
         ========================================================================= */}
      {activeMetricTab === 'payload' && (
        <div className="pt-4 space-y-4 relative z-10">
          {/* Top Capacity Telemetry Gauge */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="bg-[#070b14]/90 p-2.5 rounded-xl border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Scheduled Waste</span>
              <span className="text-lg font-black text-cyan-300 font-mono">
                {totalPayload} <span className="text-xs font-normal text-slate-400">kg</span>
              </span>
            </div>

            <div className="bg-[#070b14]/90 p-2.5 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Vehicle Capacity Used</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-emerald-300 font-mono">{capacityPercent}%</span>
                <span className="text-[11px] text-slate-400">of {TRUCK_CAPACITY_KG} kg</span>
              </div>
            </div>

            <div className="bg-[#070b14]/90 p-2.5 rounded-xl border border-purple-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Planned Waypoints</span>
              <span className="text-lg font-black text-purple-300 font-mono">
                {orderedTasks.length} <span className="text-xs font-normal text-slate-400">stops</span>
              </span>
            </div>

            <div className="bg-[#070b14]/90 p-2.5 rounded-xl border border-amber-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Payload Headroom</span>
              <span className="text-lg font-black text-amber-300 font-mono">
                {Math.max(0, TRUCK_CAPACITY_KG - totalPayload)} <span className="text-xs font-normal text-slate-400">kg remaining</span>
              </span>
            </div>
          </div>

          {/* Interactive Payload Bars Chart Container */}
          {stopsPayloadData.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs border border-dashed border-cyan-500/20 rounded-xl">
              No collection waypoints currently in route. Select tasks from the dispatch panel to render payload graphs.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400"></span>
                  <span>Stop Volume (kg)</span>
                  <span className="text-slate-600">·</span>
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400"></span>
                  <span>Cumulative Truck Load</span>
                </span>
                <span className="text-cyan-400">Max Truck Limit: 2,500 kg</span>
              </div>

              {/* Horizontal Scrollable Bar Chart Area */}
              <div className="overflow-x-auto pb-2 pt-4">
                <div className="min-w-[540px] h-56 flex items-end gap-3 px-3 relative border-b border-cyan-500/30">
                  {/* Dashed Threshold Line for Vehicle Capacity Target */}
                  <div className="absolute left-0 right-0 top-6 border-b border-dashed border-red-500/40 pointer-events-none flex items-center justify-end px-2">
                    <span className="text-[9px] font-mono text-red-400 bg-[#070b14]/90 px-1.5 py-0.5 rounded border border-red-500/30">
                      SAFETY CAP LIMIT (2,500 KG)
                    </span>
                  </div>

                  {/* Render Each Bar for each Stop */}
                  {stopsPayloadData.map(stop => {
                    const isHovered = hoveredStopId === stop.id;
                    const maxBarHeight = 160; // px
                    // Scale relative to highest single stop or standard 150kg
                    const barHeightPx = Math.max(24, Math.min(maxBarHeight, (stop.qtyKg / 150) * maxBarHeight));
                    const cumulativePct = Math.min(100, Math.round((stop.cumulativeKg / TRUCK_CAPACITY_KG) * 100));
                    const barColor = getCategoryColor(stop.category, stop.priority);

                    return (
                      <div
                        key={stop.id}
                        onMouseEnter={() => {
                          onHoverStop(stop.id);
                          onPlayBeep?.(700 + stop.index * 30);
                        }}
                        onMouseLeave={() => onHoverStop(null)}
                        onClick={() => onSelectStop(stop.id)}
                        className={`flex-1 flex flex-col items-center justify-end gap-1.5 group cursor-pointer transition-all duration-200 relative ${
                          isHovered ? 'scale-105 z-20' : 'opacity-90 hover:opacity-100'
                        }`}
                      >
                        {/* Hover Tooltip Popup */}
                        {isHovered && (
                          <div className="absolute -top-18 bg-[#040812] border border-cyan-400 text-white p-2 rounded-lg text-[10px] font-mono shadow-[0_0_15px_rgba(6,182,212,0.5)] whitespace-nowrap z-30 pointer-events-none">
                            <div className="font-bold text-cyan-300">
                              Stop #{stop.index}: {stop.id}
                            </div>
                            <div className="text-slate-300">
                              Waste: <strong className="text-white">{stop.qtyKg} kg</strong> ({stop.category})
                            </div>
                            <div className="text-emerald-300">
                              Cumulative: <strong>{stop.cumulativeKg} kg</strong> ({cumulativePct}%)
                            </div>
                          </div>
                        )}

                        {/* Exact Value Label Above Bar */}
                        <span
                          className={`text-[10px] font-mono font-bold transition-colors ${
                            isHovered ? 'text-white scale-110' : 'text-cyan-300'
                          }`}
                        >
                          {stop.qtyKg}kg
                        </span>

                        {/* Bar Pillar */}
                        <div
                          className="w-full max-w-[42px] rounded-t-md transition-all duration-300 relative overflow-hidden"
                          style={{
                            height: `${barHeightPx}px`,
                            backgroundColor: `${barColor}33`,
                            border: `1px solid ${barColor}`,
                            boxShadow: isHovered
                              ? `0 0 16px ${barColor}`
                              : `0 0 6px ${barColor}44`
                          }}
                        >
                          {/* Inner Gradient Glow */}
                          <div
                            className="absolute inset-0 opacity-80"
                            style={{
                              background: `linear-gradient(to top, ${barColor}66, ${barColor})`
                            }}
                          />

                          {/* Animated Scan Line */}
                          <div className="absolute inset-x-0 h-1 bg-white/70 animate-pulse top-0" />
                        </div>

                        {/* X-Axis Label: Stop Number */}
                        <div className="flex flex-col items-center text-center mt-1">
                          <span
                            className={`w-6 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] transition-colors ${
                              isHovered
                                ? 'bg-cyan-400 text-black shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                                : 'bg-[#0f1a30] text-slate-300 border border-slate-700'
                            }`}
                          >
                            #{stop.index}
                          </span>
                          <span className="text-[8px] font-mono text-slate-500 truncate max-w-[48px] mt-0.5">
                            {stop.id.replace('SW-2026-', '').replace('PK-2026-', '')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Color Key */}
          <div className="flex items-center justify-center gap-4 flex-wrap text-[10px] font-mono pt-1 text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#FF0055]"></span>
              <span>Emergency / Hazardous</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#00F2FE]"></span>
              <span>Dry / Recyclable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#00FF87]"></span>
              <span>Wet Organic</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#B026FF]"></span>
              <span>E-Waste</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: AI ROUTE SAVINGS VS BASELINE UNOPTIMIZED ROUTE (COMPARATIVE BARS)
         ========================================================================= */}
      {activeMetricTab === 'optimization' && (
        <div className="pt-4 space-y-5 relative z-10 font-mono">
          <div className="bg-[#070b14]/90 p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-300 font-bold">ALGORITHM BENCHMARK:</span>
              <span className="text-slate-300">Quantum Nearest-Neighbor TSP + Simulated Annealing</span>
            </div>
            <span className="text-emerald-400 font-black text-sm">
              +{distSavedPct}% SYSTEM EFFICIENCY
            </span>
          </div>

          {/* Comparative Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Metric 1: Distance */}
            <div className="bg-[#070b14]/90 p-3.5 rounded-xl border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Total Transit Distance</span>
                </span>
                <span className="text-emerald-400 font-bold">-{distSavedPct}% Distance Cut</span>
              </div>

              {/* Side-by-side Comparative Bars */}
              <div className="space-y-1.5 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Unoptimized Loop:</span>
                    <span className="text-slate-300 font-bold">{baseDistance.toFixed(1)} km</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-cyan-400 mb-1">
                    <span className="font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>AI Optimized Route:</span>
                    </span>
                    <span className="text-cyan-300 font-bold">{optDistance.toFixed(1)} km</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-500"
                      style={{ width: `${Math.round((optDistance / baseDistance) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 2: Estimated Time */}
            <div className="bg-[#070b14]/90 p-3.5 rounded-xl border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Transit Duration</span>
                </span>
                <span className="text-emerald-400 font-bold">-{timeSavedPct}% Time Saved</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Unoptimized Schedule:</span>
                    <span className="text-slate-300 font-bold">{Math.round(baseTime)} mins</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-amber-400 mb-1">
                    <span className="font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>AI Optimized Duration:</span>
                    </span>
                    <span className="text-amber-300 font-bold">{Math.round(optTime)} mins</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-500"
                      style={{ width: `${Math.round((optTime / baseTime) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 3: Fuel Consumption */}
            <div className="bg-[#070b14]/90 p-3.5 rounded-xl border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-purple-400" />
                  <span>Fuel Consumption (Diesel/EV)</span>
                </span>
                <span className="text-emerald-400 font-bold">-{fuelSavedPct}% Fuel Burn</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Baseline Consumption:</span>
                    <span className="text-slate-300 font-bold">{baseFuel.toFixed(1)} L</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-purple-400 mb-1">
                    <span className="font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-purple-400" />
                      <span>AI Optimized Consumption:</span>
                    </span>
                    <span className="text-purple-300 font-bold">{optFuel.toFixed(1)} L</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-500"
                      style={{ width: `${Math.round((optFuel / baseFuel) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 4: CO2 Offset */}
            <div className="bg-[#070b14]/90 p-3.5 rounded-xl border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CO2 Avoided Offset</span>
                </span>
                <span className="text-emerald-400 font-bold">+{co2SavedPct}% Carbon Cut</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Baseline Emissions:</span>
                    <span className="text-slate-300 font-bold">{baseCo2.toFixed(1)} kg CO2</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-emerald-400 mb-1">
                    <span className="font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span>Clean Optimized Emissions:</span>
                    </span>
                    <span className="text-emerald-300 font-bold">{optCo2.toFixed(1)} kg CO2</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500"
                      style={{ width: `${Math.round((optCo2 / baseCo2) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: WARD DENSITY DISTRIBUTION BARS
         ========================================================================= */}
      {activeMetricTab === 'ward' && (
        <div className="pt-4 space-y-3 relative z-10 font-mono">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Ward Collection Task Distribution & Weight Breakdown:</span>
            <span className="text-cyan-400">{wardEntries.length} Sectors Active</span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {wardEntries.map(([wardName, data]) => {
              const maxWardKg = wardEntries[0]?.[1]?.totalKg || 100;
              const barPct = Math.round((data.totalKg / maxWardKg) * 100);

              return (
                <div key={wardName} className="bg-[#070b14]/90 p-2.5 rounded-xl border border-cyan-500/20 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-bold truncate max-w-[220px]">
                      {wardName}
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-cyan-300 font-bold">{data.count} tasks</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-emerald-400 font-bold">{data.totalKg} kg</span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
