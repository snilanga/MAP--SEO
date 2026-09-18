'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Laptop,
  Key,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function WordPressIntegrationPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchWpData = async () => {
    try {
      const res = await fetch('/api/meta/wordpress');
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWpData();
  }, []);

  const handleGenerateToken = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/meta/wordpress', { method: 'POST' });
      const json = await res.json();
      if (json.token) {
        setToken(json.token);
        await fetchWpData();
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const snippet = data?.injectionSnippet || '<!-- Meta Pixel configured in LocalRank -->';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back Button */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-slate-500 group-hover:text-indigo-600" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-indigo-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-200">
            <Laptop className="w-3.5 h-3.5 text-blue-400" />
            WORDPRESS INTEGRATION WORKFLOW
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            WordPress Setup &amp; Plugin API
          </h1>
          <p className="text-xs text-blue-100/80 max-w-2xl leading-relaxed">
            Deploy Meta Pixel and tracking events on WordPress without touching PHP theme files. Choose manual snippet injection or API key sync for headless plugins.
          </p>
        </div>
      </div>

      {/* Dual Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Option A: Manual Installation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Option A: Manual No-Code
            </span>
            <span className="text-xs text-slate-400 font-medium">Recommended for all WP themes</span>
          </div>

          <h2 className="text-base font-bold text-slate-900">Header Snippet Injection</h2>
          <p className="text-xs text-slate-500">
            Copy the generated Pixel base code and paste it into your WordPress Header settings.
          </p>

          <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[160px] border border-slate-800">
            <code>{snippet}</code>
          </pre>

          <button
            onClick={() => {
              navigator.clipboard.writeText(snippet);
              setCopiedSnippet(true);
              setTimeout(() => setCopiedSnippet(false), 2000);
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedSnippet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSnippet ? 'Snippet Copied!' : 'Copy Header Snippet'}</span>
          </button>
        </div>

        {/* Option B: Plugin API Key Integration */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Option B: Automated API Sync
            </span>
            <span className="text-xs text-slate-400 font-medium">WordPress Plugin Key</span>
          </div>

          <h2 className="text-base font-bold text-slate-900">Headless Plugin Sync Key</h2>
          <p className="text-xs text-slate-500">
            Connect our headless LocalRank WordPress companion plugin. All pixel changes made here automatically sync to your WordPress site in real-time.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700">Your Plugin Secret Key:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={token || data?.wordpressApiToken || 'Click generate key below'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs bg-white text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const t = token || data?.wordpressApiToken;
                  if (t) {
                    navigator.clipboard.writeText(t);
                    setCopiedToken(true);
                    setTimeout(() => setCopiedToken(false), 2000);
                  }
                }}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shrink-0 transition-colors"
              >
                {copiedToken ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Endpoint: <code className="font-mono text-indigo-600 font-bold">/api/meta/wordpress?token=YOUR_KEY</code>
            </p>
          </div>

          <button
            onClick={handleGenerateToken}
            disabled={generating}
            className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Key className="w-4 h-4 text-indigo-600" />
            <span>{generating ? 'Generating Key...' : 'Generate New Plugin Sync Key'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
