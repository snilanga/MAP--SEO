'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FullAuditReport } from '@localrank/types';

export default function ReportsPage() {
  const [report, setReport] = useState<FullAuditReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then((r) => r.json())
      .then((data) => {
        if (data.report) setReport(data.report);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    window.location.href = '/api/reports?format=csv';
  };

  const handleDownloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `localrank-audit-${report.business.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
  };

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Action Bar (hidden on print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <FileText className="w-3.5 h-3.5" />
            REPORT GENERATOR & EXPORT
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Client-Ready Local SEO Audit Report
          </h1>
          <p className="text-xs text-slate-500">
            Export white-labeled audit dossiers for stakeholders, business owners, and prospect pitches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-600" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Printable Report Document Container (Requirement 20) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm space-y-10 print:border-none print:shadow-none print:p-0">
        {/* Cover Header */}
        <div className="border-b border-slate-200 pb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-indigo-600 mb-1">
              Local SEO Performance Audit
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">{report.business.name}</h2>
            <p className="text-xs text-slate-500 mt-1">
              {report.business.address} • {report.business.primaryCategory}
            </p>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Generated on {report.summary.auditDate} by LocalRank Audit Platform
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
            <ScoreGauge score={report.summary.overallScore} grade={report.summary.grade} size="lg" />
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                GBP Audit Score
              </div>
              <div className="text-xl font-black text-slate-900">
                {report.summary.overallScore} / 100
              </div>
              <span className="text-xs text-emerald-600 font-semibold">
                Grade {report.summary.grade}
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide border-l-4 border-indigo-600 pl-3">
            1. Executive Summary
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            This comprehensive local search audit evaluates the digital visibility and Google Business Profile optimization of <strong>{report.business.name}</strong>. The audit examines 8 critical dimensions: profile completeness, primary & secondary category selections, customer review velocity, landing page technical health, content depth, media coverage, Name-Address-Phone (NAP) consistency, and LocalBusiness Schema markup.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-xl font-bold text-slate-900">{report.summary.passedCount}</div>
              <div className="text-[11px] text-slate-500">Checks Passed</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-xl font-bold text-amber-600">{report.summary.warningCount}</div>
              <div className="text-[11px] text-slate-500">Warnings</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-xl font-bold text-rose-600">{report.summary.issueCount}</div>
              <div className="text-[11px] text-slate-500">Issues Found</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-xl font-bold text-slate-600">{report.summary.notAvailableCount}</div>
              <div className="text-[11px] text-slate-500">Data Unavailable</div>
            </div>
          </div>
        </div>

        {/* Priority Actions */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide border-l-4 border-rose-600 pl-3">
            2. Priority Action Items
          </h3>
          <div className="space-y-3">
            {report.priorityIssues.slice(0, 4).map((issue, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{issue.name}</span>
                  <StatusBadge status={issue.status} size="sm" />
                </div>
                <p className="text-slate-600">{issue.message}</p>
                <div className="bg-white p-2 rounded border border-slate-200 text-indigo-900 font-medium">
                  <strong>Recommendation:</strong> {issue.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide border-l-4 border-indigo-600 pl-3">
            3. Score by Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(report.categoryScores).map((cat) => (
              <div key={cat.category} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{cat.name}</span>
                  <span className="text-indigo-600">{cat.score}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Passed: {cat.passed}</span>
                  <span>Issues: {cat.issues}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NAP Consistency Reconciliation */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide border-l-4 border-emerald-600 pl-3">
            4. GBP ↔ Website NAP Reconciliation
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-[11px]">
                <tr>
                  <th className="p-3">Field</th>
                  <th className="p-3">GBP Data</th>
                  <th className="p-3">Website Crawl</th>
                  <th className="p-3">Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.consistency.map((c, i) => (
                  <tr key={i}>
                    <td className="p-3 font-bold text-slate-900">{c.field}</td>
                    <td className="p-3 text-slate-700 font-mono">{c.gbpValue}</td>
                    <td className="p-3 text-slate-700 font-mono">{c.websiteValue}</td>
                    <td className="p-3">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology & Data Sources Footer (Requirement 20) */}
        <div className="pt-8 border-t border-slate-200 text-slate-500 text-xs space-y-2">
          <h4 className="font-bold text-slate-800">Methodology & Source Transparency</h4>
          <p className="leading-relaxed">
            {report.methodologyNotes}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 text-[11px] text-slate-400">
            <span>Generated by <strong>LocalRank Audit</strong> Platform</span>
            <span>Audit Date: {report.summary.auditDate}</span>
            <span>Data Sources: Google Places API / Maps Public Info / Website Crawl</span>
          </div>
        </div>
      </div>
    </div>
  );
}
