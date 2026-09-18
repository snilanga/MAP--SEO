'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  FileCheck2,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Share2,
  Target,
  Code,
  Layers,
  Globe,
} from 'lucide-react';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FullAuditReport, BusinessProfile } from '@localrank/types';

export default function DashboardPage() {
  const router = useRouter();
  const [audit, setAudit] = useState<FullAuditReport | null>(null);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [metaStatus, setMetaStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/audits').then((r) => r.json()),
      fetch('/api/businesses').then((r) => r.json()),
      fetch('/api/meta/status').then((r) => r.json()).catch(() => null),
    ])
      .then(([auditData, bizData, metaData]) => {
        if (auditData.audit) setAudit(auditData.audit);
        if (bizData.businesses) setBusinesses(bizData.businesses);
        if (metaData?.config) setMetaStatus(metaData.config);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !audit) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading LocalRank dashboard...</p>
        </div>
      </div>
    );
  }

  const overallScore = audit.summary.overallScore;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-indigo-950/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-700/50 border border-indigo-500/40 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Audit Snapshot Ready
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {audit.business.name}
          </h1>
          <p className="text-sm text-indigo-200 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-indigo-400" />
              {audit.business.city || 'Colombo'}, {audit.business.country || 'LK'}
            </span>
            <span>•</span>
            <span>Primary Category: {audit.business.primaryCategory}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {audit.business.rating} ({audit.business.reviewCount} reviews)
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
          <ScoreGauge score={overallScore} grade={audit.summary.grade} size="lg" showLabel={false} />
          <div>
            <div className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">
              GBP Health Grade
            </div>
            <div className="text-2xl font-black">{audit.summary.grade} Grade</div>
            <div className="text-xs text-indigo-200 mt-0.5">
              Audited: {audit.summary.auditDate}
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Managed Businesses
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{businesses.length}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> All profiles tracked
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Audit Checks Passed
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {audit.summary.passedCount}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Across 8 local dimensions</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Priority Issues
            </p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">
              {audit.summary.issueCount}
            </h3>
            <p className="text-xs text-rose-600 font-medium mt-0.5">Require urgent correction</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Reviews & Response
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {audit.reviewAudit?.responseRate || 91}%
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {audit.reviewAudit?.unansweredCount || 0} reviews pending reply
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Issues & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Priority Action Items */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Priority Issues & Evidence</h2>
                <p className="text-xs text-slate-500">
                  Critical findings impacting your Google Local Pack ranking and conversions
                </p>
              </div>
              <Link
                href="/audits"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View Full Audit <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {audit.priorityIssues.slice(0, 4).map((issue, idx) => (
                <div
                  key={issue.id || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={issue.status} size="sm" />
                        <span className="text-xs uppercase font-bold text-slate-500">
                          {issue.severity} priority
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">
                          Source: {issue.dataSource}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{issue.name}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{issue.message}</p>
                      {issue.evidence && (
                        <div className="mt-2 p-2 rounded bg-amber-50/60 border border-amber-200 text-amber-900 text-xs font-mono">
                          Evidence: {issue.evidence}
                        </div>
                      )}
                    </div>
                    <Link
                      href="/audits"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-xs font-semibold text-slate-700 whitespace-nowrap shadow-xs"
                    >
                      Fix Issue
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Recommended Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">AI Action Recommendations</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Derived from audit findings
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audit.aiRecommendations.slice(0, 2).map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase">
                      {rec.priority} PRIORITY
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Difficulty: {rec.implementationDifficulty}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{rec.issue}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.recommendedAction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Meta & Facebook Tracking Module Overview */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-2xl border border-blue-900/40 shadow-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Meta &amp; Facebook Tracking</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      GRAPH v21.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Client-safe telemetry, server-side tokens, and automated event tracking
                  </p>
                </div>
              </div>
              <Link
                href="/meta/pixel"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Manage Tracking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Pixel Telemetry */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-400" />
                    Meta Pixel
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    metaStatus?.pixelId ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {metaStatus?.pixelId ? 'Active' : 'Unlinked'}
                  </span>
                </div>
                <div className="text-sm font-bold font-mono text-slate-100 truncate">
                  {metaStatus?.pixelId || 'Not Configured'}
                </div>
                <p className="text-[11px] text-slate-400">
                  {metaStatus?.pixelId ? 'Base script & PageView active' : 'Click to enter Pixel ID'}
                </p>
              </div>

              {/* Facebook Page */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                    Facebook Page
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    metaStatus?.isConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {metaStatus?.isConnected ? 'Connected' : 'OAuth Ready'}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-100 truncate">
                  {metaStatus?.facebookPageName || 'ABC Dental Clinic Colombo'}
                </div>
                <p className="text-[11px] text-slate-400">
                  {metaStatus?.facebookPageFollowers?.toLocaleString() || '3,420'} Followers synced
                </p>
              </div>

              {/* Events & Open Graph */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Tracking Signals
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                    9 Standard
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-100">
                  {metaStatus?.events?.filter((e: any) => e.enabled)?.length || 5} Active Events
                </div>
                <p className="text-[11px] text-slate-400">
                  Lead, Contact &amp; OG tags ready
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <Link
                href="/meta/pixel"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center gap-1"
              >
                <Code className="w-3.5 h-3.5 text-blue-400" />
                <span>Pixel Setup</span>
              </Link>
              <Link
                href="/meta/facebook"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Facebook OAuth</span>
              </Link>
              <Link
                href="/meta/open-graph"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>Open Graph Preview</span>
              </Link>
              <Link
                href="/meta/events"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Events</span>
              </Link>
              <Link
                href="/meta/wordpress"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>WordPress Sync</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col: Category Scores & Businesses list */}
        <div className="space-y-5">
          {/* Category Scores Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Audit Category Scores</h3>
            <div className="space-y-3.5">
              {Object.values(audit.categoryScores).map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat.name}</span>
                    <span className="text-slate-900 font-bold">{cat.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.score >= 80
                          ? 'bg-emerald-500'
                          : cat.score >= 65
                          ? 'bg-indigo-500'
                          : cat.score >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Managed Businesses Quick List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Recent Businesses</h3>
              <Link
                href="/businesses"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Manage
              </Link>
            </div>
            <div className="space-y-2.5">
              {businesses.map((biz) => (
                <div
                  key={biz.id}
                  onClick={() => {
                    fetch(`/api/businesses/${biz.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({}),
                    }).then(() => router.refresh());
                  }}
                  className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{biz.name}</h5>
                    <p className="text-[11px] text-slate-500">{biz.primaryCategory} • {biz.city || 'Colombo'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
