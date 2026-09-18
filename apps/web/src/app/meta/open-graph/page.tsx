'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Code,
  Copy,
  Check,
  Globe,
  Image as ImageIcon,
} from 'lucide-react';

export default function OpenGraphPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/meta/status')
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const og = data.openGraph || {
    ogTitle: 'ABC Dental Clinic Colombo | Advanced Cosmetic & Family Dentistry',
    ogDescription: 'ABC Dental Clinic in Colombo 03 offers cosmetic dentistry, teeth whitening, and emergency dental care.',
    ogImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80',
    ogUrl: 'https://abcdentalcolombo.example.com',
    ogType: 'website',
    facebookPageLinked: true,
    facebookPageUrl: 'https://facebook.com/abcdentalcolombo',
    status: 'PASS',
    missingTags: [],
  };

  const missingTags: string[] = og.missingTags || [];

  const recommendedMarkup = `<!-- Recommended Open Graph Social Markup -->
<meta property="og:title" content="${og.ogTitle || 'Your Business Name | Primary Local Service'}" />
<meta property="og:description" content="${og.ogDescription || 'High-converting local service description under 160 characters.'}" />
<meta property="og:image" content="${og.ogImage || 'https://yourwebsite.com/assets/og-image.jpg'}" />
<meta property="og:url" content="${og.ogUrl || 'https://yourwebsite.com'}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${og.ogTitle?.split('|')[0]?.trim() || 'Local Business'}" />`;

  const handleCopyMarkup = () => {
    navigator.clipboard.writeText(recommendedMarkup);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back Button & Navigation */}
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
            href="/meta/events"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Tracking Events
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-indigo-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-200">
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            OPEN GRAPH & SOCIAL LINK AUDIT
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Facebook / Open Graph SEO
          </h1>
          <p className="text-xs text-blue-100/80 max-w-2xl leading-relaxed">
            Audit Open Graph metadata tags to guarantee attractive, high-converting preview snippets whenever prospects or patients share your website on Facebook, WhatsApp, and Messenger.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[150px]">
          <span className="text-[10px] uppercase font-bold text-blue-200 block">OG Audit Status</span>
          <div className="text-lg font-black mt-1 flex items-center justify-center gap-1.5">
            {missingTags.length === 0 ? (
              <span className="text-emerald-300">Complete ✓</span>
            ) : (
              <span className="text-amber-300">{missingTags.length} Missing</span>
            )}
          </div>
          <span className="text-[11px] text-blue-200/80 mt-0.5 block">
            {og.facebookPageLinked ? 'Facebook Page Linked' : 'Page Unlinked'}
          </span>
        </div>
      </div>

      {/* Grid: Preview Card & Technical Tags Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Facebook Sharing Preview Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Facebook Link Sharing Preview</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live visual simulation of how your homepage link renders when posted to Facebook.
            </p>
          </div>

          {/* Facebook Mockup Card */}
          <div className="rounded-xl border border-slate-300 overflow-hidden shadow-sm bg-white max-w-md mx-auto">
            {/* Mock Image */}
            <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
              {og.ogImage ? (
                <img src={og.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs font-semibold">No og:image detected</span>
                </div>
              )}
            </div>

            {/* Mock Metadata Box */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-1">
              <span className="text-[11px] uppercase font-bold text-slate-400 block truncate">
                {og.ogUrl ? new URL(og.ogUrl).hostname.toUpperCase() : 'YOURWEBSITE.COM'}
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                {og.ogTitle || 'Missing og:title tag'}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                {og.ogDescription || 'Add an og:description tag under 160 characters to inform social users.'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Recommended Image Size:</span>
            <span className="font-bold text-slate-900">1200 × 630 px (1.91:1 ratio)</span>
          </div>
        </div>

        {/* Right Column: Tags Checklist & Code Generator */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Open Graph Tags Inspection</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified crawl checkpoints extracted from website source HTML.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'og:title', val: og.ogTitle, status: Boolean(og.ogTitle), tip: 'Title displayed in bold on Facebook post preview.' },
              { name: 'og:description', val: og.ogDescription, status: Boolean(og.ogDescription), tip: 'Summary subtitle displayed below the preview title.' },
              { name: 'og:image', val: og.ogImage, status: Boolean(og.ogImage), tip: 'Thumbnail banner image (min 600x315, ideal 1200x630).' },
              { name: 'og:url', val: og.ogUrl, status: Boolean(og.ogUrl), tip: 'Canonical destination URL.' },
              { name: 'og:type', val: og.ogType || 'website', status: Boolean(og.ogType), tip: 'Defines object type (e.g. website, business.business).' },
              { name: 'Facebook Page Link', val: og.facebookPageUrl, status: Boolean(og.facebookPageLinked), tip: 'Direct link to authentic Facebook page for brand signals.' },
            ].map((tag, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-800">{tag.name}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                    tag.status ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tag.status ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {tag.status ? 'Detected' : 'Missing'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{tag.tip}</p>
                {tag.val && <p className="text-[11px] font-mono text-slate-700 truncate pt-0.5">Value: {tag.val}</p>}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Recommended Social Markup:</span>
              <button
                type="button"
                onClick={handleCopyMarkup}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Tags'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[160px]">
              <code>{recommendedMarkup}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
