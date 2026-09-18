'use client';

import React, { useState, useEffect } from 'react';
import { Tags, CheckCircle2, AlertCircle, HelpCircle, Users2, Plus } from 'lucide-react';
import { BusinessProfile, CompetitorComparisonItem } from '@localrank/types';

export default function CategoriesPage() {
  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Category opportunities with user verification checklist
  const [opportunities, setOpportunities] = useState([
    {
      category: 'Emergency Dental Service',
      observedInCompetitor: 'Royal Dental Care Colombo',
      relevanceExplanation:
        'Relevant if your clinic offers after-hours tooth extraction, trauma, or pain relief care.',
      isVerifiedByAuditor: false,
    },
    {
      category: 'Pediatric Dentist',
      observedInCompetitor: 'Premier Dental Specialists',
      relevanceExplanation:
        'Only add if certified pediatric specialists or child dentistry facilities are available.',
      isVerifiedByAuditor: false,
    },
    {
      category: 'Dental Implants Periodontist',
      observedInCompetitor: 'Colombo Smiles Dental Care',
      relevanceExplanation:
        'Applies if specialized periodontics or surgical implant services are actively performed.',
      isVerifiedByAuditor: true,
    },
  ]);

  useEffect(() => {
    Promise.all([
      fetch('/api/businesses').then((r) => r.json()),
      fetch('/api/competitors').then((r) => r.json()),
    ])
      .then(([bizData, compData]) => {
        if (bizData.currentBusiness) setCurrentBusiness(bizData.currentBusiness);
        if (compData.competitors) setCompetitors(compData.competitors);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleVerification = (index: number) => {
    setOpportunities((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isVerifiedByAuditor: !item.isVerifiedByAuditor } : item
      )
    );
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
            <Tags className="w-3.5 h-3.5" />
            CATEGORY INTELLIGENCE
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            GBP Category Audit & Relevance Analysis
          </h1>
          <p className="text-xs text-slate-500">
            Primary category is Google’s single strongest local pack ranking factor. Analyze your current category architecture and benchmark against competitor coverage.
          </p>
        </div>
      </div>

      {/* Your Current Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Your Current Categories</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Primary Category
              </span>
              <div className="text-base font-extrabold text-indigo-950 mt-0.5 flex items-center justify-between">
                <span>{currentBusiness.primaryCategory || 'Not set'}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Configured
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500">
                Secondary Categories ({currentBusiness.secondaryCategories?.length || 0})
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentBusiness.secondaryCategories?.map((cat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Competitor Categories Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Competitor Category Coverage</h3>
          <p className="text-xs text-slate-500">
            Factual observation of categories chosen by competing dental practices in your area.
          </p>

          <div className="space-y-3">
            {competitors.map((comp) => (
              <div key={comp.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{comp.name}</span>
                  <span className="text-slate-500 font-medium">Primary: {comp.primaryCategory}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {comp.secondaryCategories.map((sc, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-white border border-slate-200 text-slate-600"
                    >
                      {sc}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Potentially Relevant Categories (Requirement 14) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Potentially Relevant Category Opportunities</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Do not add a category simply because competitors use it. Verify that your business genuinely provides this service before updating your Google Business Profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {opportunities.map((opp, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                opp.isVerifiedByAuditor
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{opp.category}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Seen in {opp.observedInCompetitor}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{opp.relevanceExplanation}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={opp.isVerifiedByAuditor}
                    onChange={() => toggleVerification(idx)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Verified Relevant to Business</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
