'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Laptop,
  CheckCircle,
} from 'lucide-react';

export default function MetaPixelPage() {
  const [pixelId, setPixelId] = useState('');
  const [pixelName, setPixelName] = useState('Website Pixel');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const fetchPixelData = async () => {
    try {
      const res = await fetch('/api/meta/pixel');
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
        if (data.config.pixelId) {
          setPixelId(data.config.pixelId);
          setPixelName(data.config.pixelName || 'Website Pixel');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPixelData();
  }, []);

  const generatedSnippet = pixelId && /^\d{14,17}$/.test(pixelId.trim())
    ? `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId.trim()}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${pixelId.trim()}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`
    : '';

  const handleCopyCode = () => {
    if (!generatedSnippet) return;
    navigator.clipboard.writeText(generatedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSavePixel = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!/^\d{14,17}$/.test(pixelId.trim())) {
      setValidationError('Invalid Meta Pixel ID format. Pixel IDs must be 14 to 17 numeric digits (e.g. 482910395820194).');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/meta/pixel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pixelId: pixelId.trim(), pixelName: pixelName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setValidationError(data.error || 'Failed to save Pixel ID');
      } else {
        setConfig(data.config);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyInstallation = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/api/meta/status');
      const data = await res.json();
      setVerificationResult(data);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back Button & Header */}
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
            href="/meta/facebook"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Facebook Page & OAuth
          </Link>
          <Link
            href="/meta/events"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Tracking Events
          </Link>
          <Link
            href="/meta/wordpress"
            className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            WordPress Guide
          </Link>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-indigo-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-200">
            <Code className="w-3.5 h-3.5 text-blue-400" />
            META PIXEL SETUP & CODE GENERATION
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Meta Pixel Configuration
          </h1>
          <p className="text-xs text-blue-100/80 max-w-2xl leading-relaxed">
            Connect and configure your Meta Pixel to track website visitors, measure conversions, and unlock retargeting audiences across Facebook and Instagram.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[160px]">
          <span className="text-[10px] uppercase font-bold text-blue-200 block">Current Status</span>
          <div className="text-base font-extrabold mt-1 flex items-center justify-center gap-1.5">
            {config?.pixelId ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Configured</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300">Not Configured</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-blue-200/80 font-mono mt-0.5 block">
            {config?.pixelId ? `ID: ${config.pixelId}` : 'No Pixel ID linked'}
          </span>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-100">Client-Side Token Security Guarantee:</span>
          <p className="text-slate-400 leading-relaxed">
            Under no circumstances are Meta access tokens, App Secrets, or private credentials stored or leaked in browser JavaScript. All OAuth exchanges and token encryption are executed strictly within authenticated server-side API routes.
          </p>
        </div>
      </div>

      {/* Pixel Input Form & Code Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pixel ID Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Enter Your Meta Pixel ID</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Locate your 15-16 digit Pixel ID in Meta Events Manager under Data Sources.
            </p>
          </div>

          <form onSubmit={handleSavePixel} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Meta Pixel ID *
              </label>
              <input
                type="text"
                value={pixelId}
                onChange={(e) => {
                  setPixelId(e.target.value);
                  setValidationError(null);
                }}
                placeholder="e.g. 482910395820194"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs outline-none focus:border-indigo-500 bg-slate-50/50"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Format: 14 to 17 digits numbers only.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pixel Label / Name
              </label>
              <input
                type="text"
                value={pixelName}
                onChange={(e) => setPixelName(e.target.value)}
                placeholder="e.g. Main Clinic Website Pixel"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            {validationError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving || !pixelId.trim()}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Validating & Saving...' : 'Save & Generate Code'}
              </button>

              <button
                type="button"
                onClick={handleVerifyInstallation}
                disabled={verifying}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Pings your website to verify if the Pixel script is active in HTML"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
                <span>Verify Live</span>
              </button>
            </div>
          </form>

          {verificationResult && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Live Verification Result:</span>
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Pixel Detected in DOM:</span>
                  <span className={`font-bold ${verificationResult.metaPixelDetected ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {verificationResult.metaPixelDetected ? '✓ Yes, Active' : '✗ Not Detected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Audit Score Contribution:</span>
                  <span className="font-bold text-indigo-600">{verificationResult.score}/100</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Snippet & Copy */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Generated Meta Pixel Base Code</h3>
              </div>

              {generatedSnippet && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Code Copied!' : 'Copy Pixel Code'}</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Paste this snippet into the header template of your website, right before the closing &lt;/head&gt; tag.
            </p>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800 max-h-[280px]">
              <code>
                {generatedSnippet || '// Enter your Meta Pixel ID on the left to generate tracking code.'}
              </code>
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
              <Laptop className="w-4 h-4 text-indigo-600" />
              <span>WordPress Installation Quick Guide</span>
            </div>
            <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1 pl-1">
              <li>Open your WordPress Admin dashboard (<code>/wp-admin</code>).</li>
              <li>Navigate to <strong>Plugins &gt; Add New</strong> and search for <em>WPCode</em> or <em>Insert Headers and Footers</em>.</li>
              <li>Click <strong>Code Snippets &gt; Header &amp; Footer</strong> and paste the copied snippet into the <strong>Header</strong> box.</li>
              <li>Save changes, then click <strong>Verify Live</strong> above to confirm data telemetry.</li>
            </ol>
            <div className="pt-1 text-right">
              <Link
                href="/meta/wordpress"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
              >
                <span>View Full WordPress &amp; Headless API Docs</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
