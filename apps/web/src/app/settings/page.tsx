'use client';

import React, { useState } from 'react';
import { Settings, Shield, Sparkles, Key, Building2, Globe, Check, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'branding' | 'integrations' | 'billing'>('branding');

  // Agency branding state
  const [agencyName, setAgencyName] = useState('Apex Local SEO Agency');
  const [agencyWebsite, setAgencyWebsite] = useState('https://apexlocalseo.example.com');
  const [agencyEmail, setAgencyEmail] = useState('reports@apexlocalseo.example.com');
  const [agencyPhone, setAgencyPhone] = useState('+94 11 777 8888');
  const [saved, setSaved] = useState(false);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Settings className="w-3.5 h-3.5" />
            PLATFORM CONFIGURATION
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Agency Settings & Integrations
          </h1>
          <p className="text-xs text-slate-500">
            Manage white-label reporting credentials, Google API keys, crawler parameters, and subscription plan.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'branding'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Agency Branding
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'integrations'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            API Integrations
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'billing'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Subscription & Usage
          </button>
        </div>
      </div>

      {/* Tab 1: Agency Branding */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">White-Label Report Branding</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These details appear on PDF and CSV reports generated for your clients.
            </p>
          </div>

          <form onSubmit={handleSaveBranding} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Agency / Company Name
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Agency Website</label>
              <input
                type="text"
                value={agencyWebsite}
                onChange={(e) => setAgencyWebsite(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={agencyEmail}
                  onChange={(e) => setAgencyEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={agencyPhone}
                  onChange={(e) => setAgencyPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                {saved ? <Check className="w-4 h-4" /> : null}
                {saved ? 'Branding Saved!' : 'Save Branding'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Integrations */}
      {activeTab === 'integrations' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">AI & Provider API Credentials</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect Google Gemini AI or Anthropic Claude AI to unlock live automated SEO copy generation, review auto-replies, and 1-click profile optimization.
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            {/* Google Gemini AI */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Google Gemini AI (Gemini 2.0 / 1.5 Flash)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Native Ready
                </span>
              </div>
              <input
                type="password"
                placeholder="AIzaSy... (Gemini API Key)"
                defaultValue=""
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono outline-none bg-white focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-500">
                Powers 1-Click AI Auto-Fix All, high-converting descriptions, and review reply drafting.
              </p>
            </div>

            {/* Anthropic Claude AI */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Anthropic Claude AI (Claude 3.7 / 3.5 Sonnet)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Supported
                </span>
              </div>
              <input
                type="password"
                placeholder="sk-ant-... (Claude API Key)"
                defaultValue=""
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono outline-none bg-white focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-500">
                Optional alternative LLM for deep reasoning and editorial copywriting.
              </p>
            </div>

            {/* Google Places API */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Google Places API</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Mock Fallback Active
                </span>
              </div>
              <input
                type="password"
                placeholder="AIzaSy..."
                defaultValue=""
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono outline-none bg-white"
              />
              <p className="text-[11px] text-slate-500">
                Leave blank to use zero-config realistic mock profiles without third-party API costs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Billing & Tiers */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                ACTIVE AGENCY LICENSE
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Unlimited Agency Pro Plan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All 7 core Local SEO intelligence suites are active with unlimited quotas.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-sm">
              All 7 Tools Unlimited
            </div>
          </div>

          {/* 7 Unlimited Pro Features Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              {
                title: 'Unlimited Audit Views',
                desc: 'Full 0–100 GBP multi-category score, rules evaluation, and client audit dossiers.',
                quota: '∞ Unlimited',
              },
              {
                title: 'Unlimited Category Finder Views',
                desc: 'Explore 160+ official Google Business categories and benchmark competitor categories.',
                quota: '∞ Unlimited',
              },
              {
                title: 'Unlimited AI Tool Views',
                desc: 'Gemini & Claude AI copy assistant, 1-click Auto-Fix All, descriptions, and post drafts.',
                quota: '∞ Unlimited',
              },
              {
                title: 'Unlimited Teleport Views',
                desc: 'Simulate Google Maps and SERP near-parameter searches from any GPS coordinates.',
                quota: '∞ Unlimited',
              },
              {
                title: 'Unlimited Local Scan Views',
                desc: 'Geo-grid 3x3 rank heatmaps across custom radii and competitor rankings.',
                quota: '∞ Unlimited',
              },
              {
                title: 'Unlimited Website Audit Views',
                desc: 'Landing page crawler, SSRF defense, LocalBusiness JSON-LD, and NAP consistency.',
                quota: '∞ Unlimited',
              },
              {
                title: 'Unlimited GBP Image Generator',
                desc: 'Generate branded cover graphics and square post banners with geotags and EXIF metadata.',
                quota: '∞ Unlimited',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.quota}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
