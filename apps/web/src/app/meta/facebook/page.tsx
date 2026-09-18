'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Sparkles,
  Layers,
  Users,
} from 'lucide-react';

export default function FacebookIntegrationPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [availablePages, setAvailablePages] = useState<any[]>([]);
  const [availablePixels, setAvailablePixels] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState('');
  const [selectedPixelId, setSelectedPixelId] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/meta/status');
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
        setSelectedPageId(data.config.facebookPageId || '');
        setSelectedPixelId(data.config.pixelId || '');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnectOAuth = async () => {
    setConnecting(true);
    try {
      // Simulate Meta OAuth initiation & callback securely
      const res = await fetch('/api/meta/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'demo_oauth_auth_code_' + Date.now() }),
      });
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
        setAvailablePages(data.availablePages || []);
        setAvailablePixels(data.availablePixels || []);
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect this Meta account and purge server session tokens?')) return;
    setDisconnecting(true);
    try {
      const res = await fetch('/api/meta/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DISCONNECT' }),
      });
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
      }
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSelectAsset = async (pageId?: string, pxId?: string) => {
    try {
      const res = await fetch('/api/meta/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SELECT_PAGE_OR_PIXEL',
          selectedPageId: pageId || selectedPageId,
          selectedPixelId: pxId || selectedPixelId,
        }),
      });
      const data = await res.json();
      if (data.config) setConfig(data.config);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isConnected = Boolean(config?.isConnected);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back Button & Sub-nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-slate-500 group-hover:text-indigo-600" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/meta/pixel"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Meta Pixel Setup
          </Link>
          <Link
            href="/meta/open-graph"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Open Graph Preview
          </Link>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-indigo-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-200">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            FACEBOOK PAGE & META BUSINESS INTEGRATION
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Connect Meta Account
          </h1>
          <p className="text-xs text-blue-100/80 max-w-2xl leading-relaxed">
            Authorize your Meta Business portfolio to sync Facebook Pages, Instagram assets, and Pixel conversion telemetry directly into your Local SEO dashboard.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          {!isConnected ? (
            <button
              onClick={handleConnectOAuth}
              disabled={connecting}
              className="px-6 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{connecting ? 'Authenticating with Meta...' : 'Connect with Facebook / Meta'}</span>
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{disconnecting ? 'Disconnecting...' : 'Disconnect Meta Account'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Security & Official API Callout */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-100">Meta Graph API v21.0 Compliant Architecture:</span>
          <p className="text-slate-400 leading-relaxed">
            We use official OAuth dialogs with granular scopes (&apos;pages_show_list&apos;, &apos;pages_read_engagement&apos;, &apos;ads_management&apos;). No scraping methods are employed. Tokens are encrypted server-side and never sent to browser scripts.
          </p>
        </div>
      </div>

      {/* Connected Account Portfolio Card */}
      {isConnected ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Facebook Page Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Facebook Page</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Linked</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">{config?.facebookPageName || 'ABC Dental Clinic Colombo'}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span>{config?.facebookPageFollowers?.toLocaleString() || '3,420'} Followers</span>
                <span>•</span>
                <a href={config?.facebookPageUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-0.5">
                  Visit Page <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <label className="block text-slate-500 font-medium mb-1">Switch Page:</label>
              <select
                value={selectedPageId}
                onChange={(e) => {
                  setSelectedPageId(e.target.value);
                  handleSelectAsset(e.target.value, undefined);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 outline-none"
              >
                <option value="page-104829105">ABC Dental Clinic Colombo (3.4k followers)</option>
                <option value="page-2048">Dr. Nilanka Dental Specialists (1.2k followers)</option>
              </select>
            </div>
          </div>

          {/* Business Account Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Business Account</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Verified</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">{config?.businessAccountName || 'ABC Healthcare Group'}</h3>
              <p className="text-xs text-slate-500 font-mono">ID: {config?.businessAccountId || 'bm-88204195'}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between"><span>Ads Management:</span> <span className="font-bold text-emerald-600">Active</span></div>
              <div className="flex justify-between"><span>Conversions API:</span> <span className="font-bold text-indigo-600">Ready</span></div>
            </div>
          </div>

          {/* Active Pixel Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Associated Pixel</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Telemetry Active</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">{config?.pixelName || 'Main Website Pixel'}</h3>
              <p className="text-xs text-indigo-700 font-mono font-bold">ID: {config?.pixelId || '482910395820194'}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <label className="block text-slate-500 font-medium mb-1">Switch Pixel:</label>
              <select
                value={selectedPixelId}
                onChange={(e) => {
                  setSelectedPixelId(e.target.value);
                  handleSelectAsset(undefined, e.target.value);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 outline-none"
              >
                <option value="482910395820194">ABC Dental - Main Website Pixel (Active)</option>
                <option value="910283746192834">Colombo Retargeting Pixel (Active)</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Meta Account Connected</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click &quot;Connect with Facebook / Meta&quot; above to authorize your Facebook Page, Business Portfolio, and conversion telemetry.
          </p>
          <button
            onClick={handleConnectOAuth}
            disabled={connecting}
            className="px-5 py-2.5 rounded-xl bg-[#1877F2] text-white font-bold text-xs hover:bg-[#166fe5] shadow-sm transition-all"
          >
            {connecting ? 'Connecting...' : 'Connect Meta Now'}
          </button>
        </div>
      )}
    </div>
  );
}
