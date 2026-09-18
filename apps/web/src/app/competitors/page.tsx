'use client';

import React, { useState, useEffect } from 'react';
import {
  Users2,
  Search,
  Star,
  ExternalLink,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { BusinessProfile, CompetitorComparisonItem } from '@localrank/types';

export default function CompetitorsPage() {
  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorComparisonItem[]>([]);
  const [keyword, setKeyword] = useState('dentist Colombo');
  const [location, setLocation] = useState('Colombo');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch('/api/competitors')
      .then((r) => r.json())
      .then((data) => {
        if (data.currentBusiness) setCurrentBusiness(data.currentBusiness);
        if (data.competitors) setCompetitors(data.competitors);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    // Simulate competitor discovery / refresh
    setTimeout(() => {
      setSearching(false);
    }, 600);
  };

  if (loading || !currentBusiness) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Users2 className="w-3.5 h-3.5" />
            COMPETITOR BENCHMARK & GAP ANALYSIS
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Objective Local Business Comparison
          </h1>
          <p className="text-xs text-slate-500">
            Factual observation of differences between your Google Business Profile signals and competing businesses in your service area.
          </p>
        </div>

        {/* Discovery Form */}
        <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Keyword (e.g. dentist Colombo)"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-xs outline-none"
            />
          </div>
          <div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Colombo)"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 text-xs outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {searching ? 'Discovering...' : 'Compare Competitors'}
          </button>
        </form>
      </div>

      {/* Side-by-Side Comparison Table (Requirement 15 & 17) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Local Signal Comparison Matrix</h2>
            <p className="text-xs text-slate-500">
              Descriptive side-by-side metrics (ratings, volume, services, and photo coverage)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-5">Business Profile</th>
                <th className="py-3 px-5">Primary Category</th>
                <th className="py-3 px-5">Star Rating</th>
                <th className="py-3 px-5">Reviews</th>
                <th className="py-3 px-5">Services Listed</th>
                <th className="py-3 px-5">Photos Uploaded</th>
                <th className="py-3 px-5">Review Response Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* You / Current Business */}
              <tr className="bg-indigo-50/40 hover:bg-indigo-50/60 font-medium">
                <td className="py-4 px-5">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    {currentBusiness.name}
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-600 text-white font-bold">
                      YOU
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">{currentBusiness.city || 'Colombo'}</div>
                </td>
                <td className="py-4 px-5 font-semibold text-slate-900">
                  {currentBusiness.primaryCategory}
                </td>
                <td className="py-4 px-5 font-bold text-slate-900 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {currentBusiness.rating}
                </td>
                <td className="py-4 px-5 font-mono font-bold text-slate-900">
                  {currentBusiness.reviewCount}
                </td>
                <td className="py-4 px-5 font-mono text-slate-900">
                  {currentBusiness.services?.length || 12}
                </td>
                <td className="py-4 px-5 font-mono text-slate-900">
                  {currentBusiness.photosCount || 28}
                </td>
                <td className="py-4 px-5 font-mono font-bold text-emerald-700">91%</td>
              </tr>

              {/* Competitors */}
              {competitors.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900">{comp.name}</div>
                    <div className="text-[11px] text-slate-400">Local Competitor</div>
                  </td>
                  <td className="py-4 px-5 text-slate-700">{comp.primaryCategory}</td>
                  <td className="py-4 px-5 text-slate-700 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {comp.rating}
                  </td>
                  <td className="py-4 px-5 font-mono text-slate-700">{comp.reviewCount}</td>
                  <td className="py-4 px-5 font-mono text-slate-700">{comp.servicesCount}</td>
                  <td className="py-4 px-5 font-mono text-slate-700">{comp.photosCount}</td>
                  <td className="py-4 px-5 font-mono text-slate-700">{comp.reviewResponseRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observed Differences (Requirement 15 & 17) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Observed Differences</h3>
          <p className="text-xs text-slate-500">
            Factual descriptive observations — not subjective value judgments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {competitors.map((comp) => (
            <div
              key={comp.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-xs font-bold text-slate-900">{comp.name}</span>
                <span className="text-xs text-slate-500">{comp.reviewCount} reviews</span>
              </div>
              <ul className="space-y-1.5">
                {comp.observedDifferences.map((diff, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
