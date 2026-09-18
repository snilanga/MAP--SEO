'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Search, RefreshCw, ShieldCheck, AlertCircle, Compass, Layers } from 'lucide-react';
import { LocalRankGridScan } from '@localrank/types';

export default function RankTrackerPage() {
  const [keyword, setKeyword] = useState('dentist near me');
  const [location, setLocation] = useState('Colombo 03');
  const [gridSize, setGridSize] = useState(3);
  const [radiusKm, setRadiusKm] = useState(5);
  const [scans, setScans] = useState<LocalRankGridScan[]>([]);
  const [selectedScan, setSelectedScan] = useState<LocalRankGridScan | null>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rank-scans')
      .then((r) => r.json())
      .then((data) => {
        if (data.rankScans && data.rankScans.length > 0) {
          setScans(data.rankScans);
          setSelectedScan(data.rankScans[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRunScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true);
    try {
      const res = await fetch('/api/rank-scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          location,
          gridSize,
          radiusKm,
        }),
      });
      const data = await res.json();
      if (data.scan) {
        setScans([data.scan, ...scans]);
        setSelectedScan(data.scan);
      }
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getRankBadgeClass = (rank: number | null) => {
    if (rank === null) return 'bg-slate-200 text-slate-500 border-slate-300';
    if (rank <= 3) return 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
    if (rank <= 5) return 'bg-indigo-500 text-white border-indigo-600 shadow-sm';
    if (rank <= 10) return 'bg-amber-500 text-white border-amber-600 shadow-sm';
    return 'bg-rose-500 text-white border-rose-600 shadow-sm';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Compass className="w-3.5 h-3.5" />
            LOCAL GEO-GRID RANK TRACKER
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Multi-Point Proximity Grid Check
          </h1>
          <p className="text-xs text-slate-500">
            Simulate geographic ranking positions across a radius from your clinic center. Fully compliant architecture without CAPTCHA bypassing or unauthorized scraping.
          </p>
        </div>

        {/* Scan Parameters Form */}
        <form onSubmit={handleRunScan} className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Keyword (e.g. dentist near me)"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-xs outline-none"
            />
          </div>
          <div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Center Location"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-xs outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none bg-white font-semibold"
            >
              <option value={3}>3 × 3 Grid</option>
              <option value={5}>5 × 5 Grid</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={scanning}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scanning...' : 'Run Grid Scan'}
          </button>
        </form>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          API Policy Compliant: respects Google terms and authorized rank provider quotas.
        </div>
      </div>

      {/* Grid Visualization Display */}
      {selectedScan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Grid Nodes */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Geo-Grid Results: "{selectedScan.keyword}"
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedScan.locationName} • Radius: {selectedScan.radiusKm} km • Grid: {selectedScan.gridSize}×{selectedScan.gridSize}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Average Rank</span>
                <div className="text-2xl font-black text-indigo-600">
                  #{selectedScan.averageRank ?? '—'}
                </div>
              </div>
            </div>

            {/* Render Matrix */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${selectedScan.gridSize}, minmax(0, 1fr))`,
                }}
              >
                {selectedScan.points.map((point, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 select-none ${getRankBadgeClass(
                      point.rank
                    )}`}
                  >
                    <span className="text-lg font-black">{point.rank ?? '—'}</span>
                    <span className="text-[9px] opacity-80 uppercase font-semibold">
                      Rank
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Rank 1–3 (Local Pack)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500" /> Rank 4–5
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" /> Rank 6–10
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" /> Rank 10+
              </span>
            </div>
          </div>

          {/* Historical Scans List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Grid Scans</h3>
            <div className="space-y-3">
              {scans.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedScan(s)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1 ${
                    selectedScan.id === s.id
                      ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 truncate max-w-[160px]">
                      {s.keyword}
                    </span>
                    <span className="font-bold text-indigo-600 font-mono">
                      Avg #{s.averageRank ?? '—'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {s.locationName} • {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
