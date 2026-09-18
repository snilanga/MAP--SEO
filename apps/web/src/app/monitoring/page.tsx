'use client';

import React, { useState } from 'react';
import { Activity, TrendingUp, CheckCircle2, AlertTriangle, Calendar, Clock, Bell } from 'lucide-react';

export default function MonitoringPage() {
  const [monitoringSchedule, setMonitoringSchedule] = useState('WEEKLY');
  const [activeAlerts, setActiveAlerts] = useState(true);

  const timeline = [
    {
      date: 'September 16, 2026',
      score: 82,
      delta: '+2',
      reviewCount: 247,
      rating: 4.7,
      changes: ['Added 2 new reviews', 'Operating hours mismatch detected on website'],
    },
    {
      date: 'September 8, 2026',
      score: 80,
      delta: '+4',
      reviewCount: 245,
      rating: 4.7,
      changes: ['Uploaded 4 new clinic photos', 'Added 2 secondary categories'],
    },
    {
      date: 'September 1, 2026',
      score: 76,
      delta: 'Initial',
      reviewCount: 239,
      rating: 4.6,
      changes: ['Baseline initial audit captured'],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Activity className="w-3.5 h-3.5" />
            AUTOMATED AUDIT MONITORING
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            GBP Health & Score Trajectory
          </h1>
          <p className="text-xs text-slate-500">
            Automatic recurring scans monitor review velocity, website NAP drifts, and algorithmic optimization changes over time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={monitoringSchedule}
            onChange={(e) => setMonitoringSchedule(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white text-slate-800"
          >
            <option value="DAILY">Daily Scan</option>
            <option value="WEEKLY">Weekly Scan</option>
            <option value="MONTHLY">Monthly Scan</option>
          </select>
        </div>
      </div>

      {/* Historical Score Trajectory Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-900">Score Progress Timeline</h3>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 ml-2">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative flex items-start gap-6 pl-8">
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />

              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{item.date}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Score: {item.score} ({item.delta})
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    {item.reviewCount} Reviews • {item.rating} Stars
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold uppercase text-slate-400">
                    Detected Variations:
                  </span>
                  <ul className="mt-1 space-y-1">
                    {item.changes.map((ch, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {ch}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
