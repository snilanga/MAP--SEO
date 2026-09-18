'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Activity,
  Code,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter,
} from 'lucide-react';

export default function TrackingEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [copiedEvent, setCopiedEvent] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/meta/events');
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleToggleEvent = async (eventName: string) => {
    const updated = events.map((ev) =>
      ev.eventName === eventName
        ? {
            ...ev,
            eventStatus: ev.eventStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
            installationStatus: ev.eventStatus === 'ACTIVE' ? 'OPTIONAL' : 'INSTALLED',
          }
        : ev
    );
    setEvents(updated);

    const activeList = updated.filter((ev) => ev.eventStatus === 'ACTIVE').map((ev) => ev.eventName);
    setSaving(true);
    try {
      await fetch('/api/meta/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeEvents: activeList }),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopiedEvent(name);
    setTimeout(() => setCopiedEvent(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = activeCategory === 'ALL'
    ? events
    : events.filter((ev) => ev.category === activeCategory);

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
            href="/meta/facebook"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Facebook Page & OAuth
          </Link>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-indigo-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-200">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            STANDARD TRACKING TELEMETRY
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Meta Pixel Conversion Events
          </h1>
          <p className="text-xs text-blue-100/80 max-w-2xl leading-relaxed">
            Configure the 9 standard Meta Pixel tracking events. Track appointments, phone calls, checkouts, and high-value lead conversions across your website funnel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Active Events</span>
            <div className="text-2xl font-black mt-0.5 text-emerald-300">
              {events.filter((e) => e.eventStatus === 'ACTIVE').length} / {events.length}
            </div>
            <span className="text-[10px] text-blue-200/70 block">Auto-Sync Active</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Category:
          </span>
          {[
            { label: 'All 9 Events', id: 'ALL' },
            { label: 'Standard', id: 'STANDARD' },
            { label: 'Lead Generation', id: 'LEAD_GEN' },
            { label: 'E-Commerce / Checkout', id: 'ECOMMERCE' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {saving && <span className="text-xs text-indigo-600 font-semibold animate-pulse">Saving changes...</span>}
      </div>

      {/* Events Table / Card Feed */}
      <div className="space-y-4">
        {filtered.map((ev) => (
          <div
            key={ev.eventName}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 hover:border-indigo-200 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleEvent(ev.eventName)}
                  className="cursor-pointer"
                  title="Toggle event active status"
                >
                  {ev.eventStatus === 'ACTIVE' ? (
                    <ToggleRight className="w-7 h-7 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-300" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-slate-900 font-mono">fbq(&#39;track&#39;, &#39;{ev.eventName}&#39;)</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                      ev.eventStatus === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {ev.eventStatus}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded-full border border-indigo-200">
                      {ev.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{ev.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[11px] font-semibold text-slate-400">
                  {ev.installationStatus === 'INSTALLED' ? '✓ Installed' : 'Optional'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(ev.eventCode, ev.eventName)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedEvent === ev.eventName ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEvent === ev.eventName ? 'Copied' : 'Copy Event Code'}</span>
                </button>
              </div>
            </div>

            {/* Code Snippet Box */}
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              <code>{ev.eventCode}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
