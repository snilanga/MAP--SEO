'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Code2,
  CheckCircle2,
  XCircle,
  FileCode,
  Smartphone,
  Zap,
  Building2,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { WebsiteAuditData, ConsistencyCheckItem, BusinessProfile } from '@localrank/types';

export default function WebsiteAuditPage() {
  const [urlInput, setUrlInput] = useState('');
  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile | null>(null);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [websiteAudit, setWebsiteAudit] = useState<WebsiteAuditData | null>(null);
  const [consistency, setConsistency] = useState<ConsistencyCheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = () => {
    fetch('/api/website-audits')
      .then((r) => r.json())
      .then((data) => {
        if (data.currentBusiness) setCurrentBusiness(data.currentBusiness);
        if (data.businesses) setBusinesses(data.businesses);
        if (data.websiteAudit) {
          setWebsiteAudit(data.websiteAudit);
          setUrlInput(data.websiteAudit.url);
        } else {
          setWebsiteAudit(null);
          setUrlInput(data.currentBusiness?.website || '');
        }
        if (data.consistency) setConsistency(data.consistency);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSwitchBusiness = async (bizId: string) => {
    setLoading(true);
    try {
      await fetch(`/api/businesses/${bizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      loadData();
    } finally {
      setLoading(false);
    }
  };

  const handleCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    let target = urlInput.trim();
    if (!target) return;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`;
      setUrlInput(target);
    }
    setCrawling(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/website-audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: target,
          businessId: currentBusiness?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Crawl failed');
      } else {
        setWebsiteAudit(data.data);
        if (data.audit?.consistency) {
          setConsistency(data.audit.consistency);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setCrawling(false);
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
      {/* Header & Crawler URL Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Globe className="w-3.5 h-3.5" />
            WEBSITE & LOCAL SEO AUDIT
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Landing Page & NAP Consistency Engine
          </h1>
          <p className="text-xs text-slate-500">
            Crawl public landing pages, verify LocalBusiness JSON-LD schema, on-page SEO signals, and detect NAP discrepancies against your Google Business Profile.
          </p>
        </div>

        {/* Active Profile Context Banner */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Audited Business Profile
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {currentBusiness?.name || 'Local Business'}
                {currentBusiness?.primaryCategory && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                    {currentBusiness.primaryCategory}
                  </span>
                )}
              </div>
            </div>
          </div>

          {businesses.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium shrink-0">Switch Profile:</span>
              <select
                value={currentBusiness?.id || ''}
                onChange={(e) => handleSwitchBusiness(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white outline-none focus:border-indigo-500 shadow-2xs"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <form onSubmit={handleCrawl} className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={crawling}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${crawling ? 'animate-spin' : ''}`} />
            {crawling ? 'Crawling Website...' : 'Crawl & Audit'}
          </button>
        </form>

        {currentBusiness?.website && urlInput !== currentBusiness.website && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Profile website:</span>
            <button
              type="button"
              onClick={() => setUrlInput(currentBusiness.website || '')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {currentBusiness.website} (click to pre-fill)
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {errorMsg}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          SSRF protected: private IP ranges, localhost, and cloud metadata access strictly prevented.
        </div>
      </div>

      {/* GBP ↔ Website Consistency Matrix (Requirement 11) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              GBP ↔ Website Consistency (NAP)
            </h2>
            <p className="text-xs text-slate-500">
              Automated entity reconciliation between Google Business Profile listings and audited website
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-5">Entity Field</th>
                <th className="py-3 px-5">Google Business Profile</th>
                <th className="py-3 px-5">Website Crawl</th>
                <th className="py-3 px-5">Match Status</th>
                <th className="py-3 px-5">Evidence & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consistency.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-5 font-bold text-slate-900">{item.field}</td>
                  <td className="py-4 px-5 font-mono text-slate-700 max-w-xs truncate">
                    {item.gbpValue}
                  </td>
                  <td className="py-4 px-5 font-mono text-slate-700 max-w-xs truncate">
                    {item.websiteValue}
                  </td>
                  <td className="py-4 px-5">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-4 px-5 text-slate-500 max-w-sm">
                    {item.evidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical & On-Page SEO Checks or Empty State */}
      {websiteAudit ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Technical Signals */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Zap className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Technical Web Architecture</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">HTTPS Security</span>
                <span className="font-semibold text-emerald-600">
                  {websiteAudit.isHttps ? 'Enforced (Valid SSL)' : 'Insecure (HTTP)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Mobile Viewport</span>
                <span className="font-semibold text-emerald-600">
                  {websiteAudit.isResponsive ? 'Configured' : 'Missing'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Robots.txt & Sitemap</span>
                <span className="font-semibold text-slate-800">
                  Robots: {websiteAudit.robotsTxtPresent ? 'Yes' : 'No'} • Sitemap:{' '}
                  {websiteAudit.sitemapPresent ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Response Speed</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {websiteAudit.responseTimeMs} ms
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">LocalBusiness Schema (JSON-LD)</span>
                <span
                  className={`font-semibold ${
                    websiteAudit.hasLocalBusinessSchema ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {websiteAudit.hasLocalBusinessSchema ? 'Detected' : 'Missing (High Impact)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Schema Types Found</span>
                <span className="font-mono text-slate-700">
                  {websiteAudit.schemaTypesFound.join(', ') || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* On-Page Signals */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileCode className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">On-Page Content & Semantics</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1 py-1.5 border-b border-slate-50">
                <div className="flex justify-between">
                  <span className="text-slate-500">Title Tag ({websiteAudit.titleLength} chars)</span>
                  <StatusBadge
                    status={websiteAudit.titleLength >= 40 && websiteAudit.titleLength <= 65 ? 'PASS' : 'WARNING'}
                    size="sm"
                  />
                </div>
                <p className="font-medium text-slate-800 text-[11px]">{websiteAudit.title}</p>
              </div>

              <div className="space-y-1 py-1.5 border-b border-slate-50">
                <div className="flex justify-between">
                  <span className="text-slate-500">Meta Description ({websiteAudit.metaDescriptionLength} chars)</span>
                  <StatusBadge status={websiteAudit.metaDescriptionLength > 100 ? 'PASS' : 'WARNING'} size="sm" />
                </div>
                <p className="font-medium text-slate-800 text-[11px]">{websiteAudit.metaDescription}</p>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Primary H1 Heading</span>
                <span className="font-semibold text-slate-800">
                  {websiteAudit.h1Tags?.[0] || 'No H1 found'}
                </span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Word Count & Images</span>
                <span className="font-semibold text-slate-800">
                  {websiteAudit.wordCount} words • {websiteAudit.totalImages} images ({websiteAudit.imagesWithoutAlt} missing alt)
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Website Crawl Data for {currentBusiness?.name || 'Selected Business'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Enter the website URL in the box above and click <strong className="text-indigo-600">&quot;Crawl &amp; Audit&quot;</strong> to scan on-page tags, verify LocalBusiness JSON-LD schema, and evaluate NAP consistency.
          </p>
        </div>
      )}
    </div>
  );
}
