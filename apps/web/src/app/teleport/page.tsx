'use client';

import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Search,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface TeleportPreset {
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

const TELEPORT_PRESETS: TeleportPreset[] = [
  { name: 'Colombo 03 (Kollupitiya)', city: 'Colombo', country: 'Sri Lanka', lat: 6.9015, lng: 79.8529 },
  { name: 'Colombo 01 (Fort Financial)', city: 'Colombo', country: 'Sri Lanka', lat: 6.9344, lng: 79.8428 },
  { name: 'Colombo 07 (Cinnamon Gardens)', city: 'Colombo', country: 'Sri Lanka', lat: 6.9098, lng: 79.8698 },
  { name: 'Kandy City Center', city: 'Kandy', country: 'Sri Lanka', lat: 7.2906, lng: 80.6337 },
  { name: 'Times Square, New York', city: 'New York', country: 'United States', lat: 40.758, lng: -73.9855 },
  { name: 'Oxford Circus, London', city: 'London', country: 'United Kingdom', lat: 51.5152, lng: -0.1419 },
  { name: 'Downtown Dubai', city: 'Dubai', country: 'UAE', lat: 25.1972, lng: 55.2744 },
  { name: 'Sydney Opera House / CBD', city: 'Sydney', country: 'Australia', lat: -33.8568, lng: 151.2153 },
  { name: 'Marina Bay, Singapore', city: 'Singapore', country: 'Singapore', lat: 1.2834, lng: 103.8607 },
];

export default function TeleportPage() {
  const [keyword, setKeyword] = useState('Dentist near me');
  const [locationName, setLocationName] = useState('Colombo 03, Sri Lanka');
  const [latitude, setLatitude] = useState(6.9015);
  const [longitude, setLongitude] = useState(79.8529);
  const [zoom, setZoom] = useState(15);
  const [isTeleported, setIsTeleported] = useState(true);

  // Generate Google Maps Teleport URL
  const googleMapsTeleportUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    keyword
  )}/@${latitude},${longitude},${zoom}z`;

  // Generate Google Local Search SERP URL (forcing location near)
  const googleSearchTeleportUrl = `https://www.google.com/search?q=${encodeURIComponent(
    keyword
  )}&near=${encodeURIComponent(locationName)}`;

  const handleApplyPreset = (preset: TeleportPreset) => {
    setLocationName(`${preset.name}, ${preset.country}`);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Compass className="w-3.5 h-3.5" />
              TELEPORT SEARCH SIMULATOR
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Google Maps & Search Teleport Engine
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Simulate Google Search & Google Maps local pack results as if you are standing anywhere in the world. Eliminate local IP and GPS proximity bias to see true client rankings.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200 px-4 py-3 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                Unlimited Teleport Views
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                Active Pro Agency License
              </div>
            </div>
          </div>
        </div>

        {/* Teleport Controller Form */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
          <div className="space-y-4 lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Search Query / Keyword *
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. Cosmetic Dentist, Auto Repair..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teleport Location Name
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Colombo 03, Sri Lanka"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:border-indigo-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:border-indigo-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Zoom Level ({zoom}z)
                </label>
                <input
                  type="range"
                  min="10"
                  max="19"
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 mt-2"
                />
              </div>
            </div>

            {/* Launch Teleport Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={googleMapsTeleportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Navigation className="w-4 h-4" />
                Teleport Google Maps (Coordinates) <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={googleSearchTeleportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all"
              >
                <Globe className="w-4 h-4 text-indigo-600" />
                Teleport Google SERP (Near Parameter) <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Quick Presets Column */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Teleport Presets
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">1-Click</span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {TELEPORT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 text-xs transition-all flex items-center justify-between group"
                >
                  <span className="font-semibold text-slate-700 group-hover:text-indigo-900 truncate">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                    {preset.city}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Teleport Local Pack & SERP Result */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Simulated Teleport SERP & Local 3-Pack
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulating search query &ldquo;{keyword}&rdquo; centered at GPS [{latitude.toFixed(4)}, {longitude.toFixed(4)}] ({locationName})
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Virtual GPS Lock Active
          </span>
        </div>

        {/* Teleport Coordinates Banner */}
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-950">Active Teleport Anchor:</span>
            <span className="font-mono bg-white px-2.5 py-1 rounded-md border border-indigo-200 text-indigo-700">
              {latitude}, {longitude}
            </span>
            <span className="text-slate-600 font-medium">({locationName})</span>
          </div>
          <div className="text-[11px] text-indigo-800 font-medium">
            Simulated Distance Bias: <strong className="font-bold">0.0 km radius</strong>
          </div>
        </div>

        {/* Mock Local Pack Results */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Simulated Local 3-Pack at this Teleport Location
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/20 space-y-2 relative">
              <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                #1
              </span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Top Ranked</span>
              <h4 className="text-sm font-bold text-slate-900">ABC Dental Clinic</h4>
              <p className="text-xs text-slate-500">★ 4.7 (247 reviews) • Dentist</p>
              <p className="text-xs text-slate-600 font-mono">0.3 km from teleport anchor</p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-600">
                ✓ Perfect Proximity & NAP match
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 relative">
              <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center">
                #2
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Competitor</span>
              <h4 className="text-sm font-bold text-slate-900">Colombo Smiles Dental Care</h4>
              <p className="text-xs text-slate-500">★ 4.5 (182 reviews) • Dentist</p>
              <p className="text-xs text-slate-600 font-mono">0.9 km from teleport anchor</p>
              <div className="pt-2 text-[11px] font-semibold text-slate-500">
                Secondary category gap
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 relative">
              <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center">
                #3
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Competitor</span>
              <h4 className="text-sm font-bold text-slate-900">Royal Dental Clinic</h4>
              <p className="text-xs text-slate-500">★ 4.3 (95 reviews) • Dental Clinic</p>
              <p className="text-xs text-slate-600 font-mono">1.4 km from teleport anchor</p>
              <div className="pt-2 text-[11px] font-semibold text-slate-500">
                Low review reply rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
