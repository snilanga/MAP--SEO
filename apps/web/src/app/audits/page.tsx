'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Printer,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bot,
  Copy,
  Check,
  CheckCircle2,
  X,
  Code2,
  MessageSquare,
  Building2,
  CheckCheck,
  Zap,
} from 'lucide-react';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FullAuditReport, AuditFinding, FindingCategory, BusinessProfile } from '@localrank/types';

export default function AuditsPage() {
  const [audit, setAudit] = useState<FullAuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);

  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [switchingBiz, setSwitchingBiz] = useState(false);

  // AI Auto-Fix State
  const [autoFixModalOpen, setAutoFixModalOpen] = useState(false);
  const [autoFixLoading, setAutoFixLoading] = useState(false);
  const [autoFixResult, setAutoFixResult] = useState<any>(null);
  const [autoFixProvider, setAutoFixProvider] = useState<'auto' | 'gemini' | 'claude'>('auto');
  const [autoFixTab, setAutoFixTab] = useState<'profile' | 'schema' | 'reviews' | 'posts'>('profile');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // AI Content Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draftType, setDraftType] = useState<string>('gbp_description');
  const [generatedDraft, setGeneratedDraft] = useState<any>(null);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const handleRunAutoFix = async (provider?: 'auto' | 'gemini' | 'claude') => {
    const prov = provider || autoFixProvider;
    setAutoFixLoading(true);
    try {
      const res = await fetch('/api/ai/auto-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: prov }),
      });
      const data = await res.json();
      if (data.result) {
        setAutoFixResult(data.result);
      }
      if (data.audit) {
        setAudit(data.audit);
      }
    } finally {
      setAutoFixLoading(false);
    }
  };

  const copyText = (section: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const fetchAuditData = async () => {
    try {
      const [auditRes, bizRes] = await Promise.all([
        fetch('/api/audits'),
        fetch('/api/businesses'),
      ]);
      const auditData = await auditRes.json();
      const bizData = await bizRes.json();
      if (auditData.audit) setAudit(auditData.audit);
      if (bizData.businesses) setBusinesses(bizData.businesses);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchBusiness = async (bizId: string) => {
    setSwitchingBiz(true);
    try {
      await fetch(`/api/businesses/${bizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setAutoFixResult(null);
      await fetchAuditData();
    } finally {
      setSwitchingBiz(false);
    }
  };

  const handleRerunAudit = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.audit) setAudit(data.audit);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGenerateDraft = async (type: string) => {
    setGeneratingDraft(true);
    setDraftType(type);
    try {
      const res = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.draft) setGeneratedDraft(data.draft);
    } finally {
      setGeneratingDraft(false);
    }
  };

  const handleCopyDraft = () => {
    if (!generatedDraft?.content) return;
    navigator.clipboard.writeText(generatedDraft.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !audit) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredFindings =
    activeCategoryFilter === 'all'
      ? audit.findings
      : audit.findings.filter((f) => f.category === activeCategoryFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Active Profile Context Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-lg">
            {audit.business.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Active Audit Profile</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                {audit.business.primaryCategory}
              </span>
            </div>
            <h2 className="text-base font-bold text-white">{audit.business.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Switch Profile:</span>
          <select
            value={audit.business.id}
            disabled={switchingBiz}
            onChange={(e) => handleSwitchBusiness(e.target.value)}
            className="w-full sm:w-auto bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.primaryCategory})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                GBP AUDIT
              </span>
              <span className="text-xs text-slate-500">
                Last checked: {audit.summary.auditDate}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {audit.business.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Source: {audit.business.dataSource} • {audit.business.address || 'Address verified'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <ScoreGauge score={audit.summary.overallScore} grade={audit.summary.grade} size="lg" />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setAutoFixModalOpen(true);
                  if (!autoFixResult) {
                    handleRunAutoFix();
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white text-xs font-bold shadow-md hover:shadow-indigo-200 transition-all border border-indigo-400/30"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                1-Click AI Auto-Fix All
              </button>
              <button
                onClick={handleRerunAudit}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Re-auditing...' : 'Re-Run Audit'}
              </button>
              <button
                onClick={() => {
                  setDrawerOpen(true);
                  handleGenerateDraft('gbp_description');
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                Single Draft Assistant
              </button>
            </div>
          </div>
        </div>

        {/* Audit Stats Tally */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-lg font-bold text-emerald-950">
                {audit.summary.passedCount}
              </div>
              <div className="text-xs text-emerald-700 font-medium">Passed Checks</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <div className="text-lg font-bold text-amber-950">
                {audit.summary.warningCount}
              </div>
              <div className="text-xs text-amber-700 font-medium">Warnings</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-rose-600" />
            <div>
              <div className="text-lg font-bold text-rose-950">
                {audit.summary.issueCount}
              </div>
              <div className="text-xs text-rose-700 font-medium">Priority Issues</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-slate-500" />
            <div>
              <div className="text-lg font-bold text-slate-800">
                {audit.summary.notAvailableCount}
              </div>
              <div className="text-xs text-slate-600 font-medium">Not Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Issues Spotlight (Requirement 9) */}
      <div className="bg-rose-50/40 border border-rose-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-5 h-5 text-rose-600" />
          <h2 className="text-base font-bold text-rose-950">Top Priority Action Required</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audit.priorityIssues.slice(0, 3).map((issue, idx) => (
            <div
              key={issue.id}
              className="bg-white rounded-xl p-4 border border-rose-200 shadow-xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    Priority #{idx + 1} • {issue.severity}
                  </span>
                  <StatusBadge status={issue.status} size="sm" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{issue.name}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong className="text-slate-800">Problem:</strong> {issue.message}
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong className="text-slate-800">Why it matters:</strong> {issue.explanation}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 mt-2">
                <p className="text-xs font-medium text-indigo-900 bg-indigo-50/60 p-2 rounded border border-indigo-100">
                  <strong>Recommendation:</strong> {issue.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs by Category */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold scrollbar-thin">
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeCategoryFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Checks ({audit.findings.length})
        </button>
        {Object.values(audit.categoryScores).map((cat) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategoryFilter(cat.category)}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeCategoryFilter === cat.category
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.name}
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                activeCategoryFilter === cat.category
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {cat.score}%
            </span>
          </button>
        ))}
      </div>

      {/* Detailed Findings Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Comprehensive Audit Checks</h3>
            <p className="text-xs text-slate-500">
              Granular evaluation of all local ranking signals and profile completeness
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredFindings.length} checks
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFindings.map((finding) => {
            const isExpanded = expandedFindingId === finding.id;

            return (
              <div key={finding.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedFindingId(isExpanded ? null : finding.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={finding.status} size="sm" />
                      <span className="text-xs uppercase font-semibold text-slate-400">
                        {finding.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400">
                        Source: {finding.dataSource}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{finding.name}</h4>
                    <p className="text-xs text-slate-600">{finding.message}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {finding.evidence && (
                      <span className="hidden sm:inline text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded max-w-xs truncate">
                        {finding.evidence}
                      </span>
                    )}
                    <button className="p-1 rounded text-slate-400 hover:text-slate-700">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Inspection Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50 p-4 rounded-xl text-xs animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-slate-700">Why this matters:</span>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{finding.explanation}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Recommended Action:</span>
                        <p className="text-indigo-900 bg-white p-2.5 rounded border border-indigo-100 mt-0.5 leading-relaxed font-medium">
                          {finding.recommendation}
                        </p>
                      </div>
                    </div>
                    {finding.evidence && (
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Evidence: <code>{finding.evidence}</code></span>
                        <span>Confidence: {Math.round(finding.confidence * 100)}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Content Assistant Modal Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">AI Local SEO Content Assistant</h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* Draft Type Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'gbp_description', label: 'GBP Description' },
                  { id: 'review_reply', label: 'Review Response' },
                  { id: 'service_description', label: 'Service Catalog Item' },
                  { id: 'meta_tags', label: 'SEO Title & Meta' },
                  { id: 'landing_page_outline', label: 'Location Page Outline' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleGenerateDraft(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      draftType === t.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Draft Display Area */}
              {generatingDraft ? (
                <div className="p-10 flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-500">Drafting personalized content...</span>
                </div>
              ) : generatedDraft ? (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-semibold flex items-center justify-between">
                    <span>{generatedDraft.notice}</span>
                    <button
                      onClick={handleCopyDraft}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono whitespace-pre-wrap text-slate-800 leading-relaxed max-h-72 overflow-y-auto">
                    {generatedDraft.content}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
              >
                Close Assistant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1-Click AI Auto-Fix Modal */}
      {autoFixModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">
                    Agency Pro AI
                  </span>
                  <span className="text-xs text-indigo-200">Google Gemini & Claude 3.5 Engine</span>
                </div>
                <h3 className="text-xl font-extrabold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  1-Click AI Auto-Fix Optimizer
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Diagnoses and fixes all GBP audit gaps, optimizing description, services, schema JSON-LD, reviews & posts.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Provider Selector */}
                <div className="bg-slate-800/80 p-1 rounded-lg border border-slate-700 flex items-center gap-1">
                  {(['auto', 'gemini', 'claude'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setAutoFixProvider(p);
                        handleRunAutoFix(p);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        autoFixProvider === p
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {p === 'auto' ? 'Auto Smart' : p === 'gemini' ? 'Gemini AI' : 'Claude SEO'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setAutoFixModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {autoFixLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                    <Sparkles className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Analyzing Profile & Generating 100% Compliant Optimizations...
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      Generating high-converting GBP description, 8 targeted local services, LocalBusiness schema JSON-LD, review replies, and post updates.
                    </p>
                  </div>
                </div>
              ) : autoFixResult ? (
                <>
                  {/* Results Metric Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                        <CheckCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                          Audit Score Upgraded
                        </div>
                        <div className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                          <span className="line-through text-slate-400 text-sm font-semibold">
                            {audit.summary.overallScore} / 100
                          </span>
                          <span className="text-emerald-700">
                            {autoFixResult.newAuditScore} / 100 (Grade A+)
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                            +{autoFixResult.appliedFixesCount} Fixes Applied
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Provider:</span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-sm">
                        {autoFixResult.aiProviderUsed}
                      </span>
                      <button
                        onClick={() => handleRunAutoFix()}
                        className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Regenerate
                      </button>
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                    {[
                      { id: 'profile', label: '1. GBP Description & Services', icon: Building2 },
                      { id: 'schema', label: '2. LocalBusiness Schema & Meta', icon: Code2 },
                      { id: 'reviews', label: '3. Review AI Responses', icon: MessageSquare },
                      { id: 'posts', label: '4. GBP Post Drafts', icon: Zap },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setAutoFixTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                            autoFixTab === tab.id
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab 1: Profile Description & Services */}
                  {autoFixTab === 'profile' && (
                    <div className="space-y-5">
                      {/* Description */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                            Optimized GBP Description
                            <span className="text-[11px] font-normal text-slate-500 lowercase">
                              ({autoFixResult.optimizedDescription?.length || 0} / 750 characters)
                            </span>
                          </label>
                          <button
                            onClick={() => copyText('desc', autoFixResult.optimizedDescription)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            {copiedSection === 'desc' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy Description
                              </>
                            )}
                          </button>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans leading-relaxed text-slate-800 whitespace-pre-line">
                          {autoFixResult.optimizedDescription}
                        </div>
                      </div>

                      {/* Services */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                              Recommended High-Intent Services ({autoFixResult.recommendedServices?.length || 0})
                            </label>
                            <p className="text-[11px] text-slate-500">
                              Populate Google Profile Services menu to rank for high-intent customer search terms.
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              copyText('services', autoFixResult.recommendedServices?.join('\n') || '')
                            }
                            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            {copiedSection === 'services' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                Copied All
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy Services List
                              </>
                            )}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {autoFixResult.recommendedServices?.map((service: string, idx: number) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs font-medium text-indigo-950"
                            >
                              <span>{service}</span>
                              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Schema & Meta */}
                  {autoFixTab === 'schema' && (
                    <div className="space-y-5">
                      {/* Website Meta */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Recommended Website SEO Meta Tags
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs">
                            <span className="font-semibold text-slate-600">Title Tag: </span>
                            <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              {autoFixResult.websiteTitle}
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="font-semibold text-slate-600">Meta Description: </span>
                            <span className="font-sans text-slate-700 bg-white p-2 rounded block border border-slate-200 mt-1">
                              {autoFixResult.websiteMetaDescription}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Schema JSON-LD */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                              Structured Data: LocalBusiness Schema (JSON-LD)
                            </label>
                            <p className="text-[11px] text-slate-500">
                              Paste inside the &lt;head&gt; tag of your website to validate NAP and Google Maps integration.
                            </p>
                          </div>
                          <button
                            onClick={() => copyText('schema', autoFixResult.jsonLdSchema)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                          >
                            {copiedSection === 'schema' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                Copied Schema
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy JSON-LD
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 rounded-xl bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto max-h-72 border border-slate-800">
                          {autoFixResult.jsonLdSchema}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Review Replies */}
                  {autoFixTab === 'reviews' && (
                    <div className="space-y-4">
                      <div className="text-xs text-slate-500">
                        AI-generated responses personalized to each customer review to boost engagement and local trust signals.
                      </div>
                      {autoFixResult.reviewReplies?.map((r: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{r.customerName}</span>
                              <span className="text-amber-500 text-xs">
                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                              </span>
                            </div>
                            <button
                              onClick={() => copyText(`reply-${idx}`, r.reply)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                            >
                              {copiedSection === `reply-${idx}` ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy Reply
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 italic">"{r.reviewSnippet}"</p>
                          <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs text-slate-800 font-medium leading-relaxed">
                            <span className="font-bold text-indigo-900 block mb-1">Owner Response:</span>
                            {r.reply}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 4: GBP Post Drafts */}
                  {autoFixTab === 'posts' && (
                    <div className="space-y-4">
                      <div className="text-xs text-slate-500">
                        Ready-to-publish Google Updates designed to trigger Google's freshness ranking factor.
                      </div>
                      {autoFixResult.gbpPostDrafts?.map((post: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                              {post.topic}
                            </span>
                            <button
                              onClick={() => copyText(`post-${idx}`, post.content)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                            >
                              {copiedSection === `post-${idx}` ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy Post
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                            <span className="font-bold text-slate-700">Recommended Button:</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700">
                              {post.cta}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Unlimited Pro Agency License Active</span>
              </div>
              <button
                onClick={() => setAutoFixModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                Done / Close Optimizer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
