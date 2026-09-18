'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bot,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  ArrowLeft,
  Clock,
  Check,
  Building2,
  FileCheck2,
  Globe,
  Star,
  Layers,
} from 'lucide-react';

export default function AgentBotPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runningCycle, setRunningCycle] = useState(false);
  const [autoPilot, setAutoPilot] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<'auto' | 'gemini' | 'claude'>('auto');

  const fetchAgentData = async () => {
    try {
      const res = await fetch('/api/agent-bot');
      const json = await res.json();
      if (json.agentState) {
        setData(json);
        setAutoPilot(json.agentState.isAutoPilotActive);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentData();
    const interval = setInterval(fetchAgentData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAutoPilot = async () => {
    try {
      const res = await fetch('/api/agent-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_AUTOPILOT' }),
      });
      const json = await res.json();
      if (json.agentState) {
        setAutoPilot(json.agentState.isAutoPilotActive);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunFullCycle = async () => {
    setRunningCycle(true);
    try {
      const res = await fetch('/api/agent-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'FULL_AUTO_EXECUTE',
          provider: selectedProvider,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchAgentData();
      }
    } finally {
      setRunningCycle(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const agentState = data.agentState;
  const currentBiz = data.currentBusiness;
  const auditSummary = data.auditSummary;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back to Home Button */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold transition-all shadow-sm group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-slate-500 group-hover:text-indigo-600" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            AUTONOMOUS LOCAL SEO AGENT BOT ACTIVE
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
            <Bot className="w-7 h-7 text-indigo-400" />
            Full Auto SEO Copilot
          </h1>
          <p className="text-xs text-indigo-200/90 max-w-2xl leading-relaxed">
            Continuously monitors GBP health signals, review sentiment velocities, and landing page NAP consistencies. Automatically synthesizes fixes and executes algorithmic optimizations without manual intervention.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={handleToggleAutoPilot}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border shadow-sm ${
              autoPilot
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {autoPilot ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {autoPilot ? 'AutoPilot: RUNNING' : 'AutoPilot: PAUSED'}
          </button>

          <button
            onClick={handleRunFullCycle}
            disabled={runningCycle}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${runningCycle ? 'animate-spin' : ''}`} />
            {runningCycle ? 'Executing Cycle...' : 'Run Auto Cycle Now'}
          </button>
        </div>
      </div>

      {/* 4 Agent Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Profile Health Score
            </p>
            <div className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              {agentState.overallHealthScore}/100
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Grade {auditSummary.grade}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Business
            </p>
            <div className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[150px]">
              {currentBiz.name}
            </div>
            <p className="text-[11px] text-slate-400">{currentBiz.primaryCategory}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed Actions
            </p>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {agentState.actionsHistory.length}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">100% Autonomous</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cycle Frequency
            </p>
            <div className="text-2xl font-black text-slate-900 mt-1">
              Real-Time
            </div>
            <p className="text-[11px] text-slate-400">Continuous background scan</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Provider Selector & Safeguards */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-900">
            Authenticity & Verification Safeguard:
          </span>
          <span className="text-xs text-slate-500">
            Real Google Maps coordinates & zero fabricated review metrics.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">AI Intelligence Core:</span>
          <select
            value={selectedProvider}
            onChange={(e: any) => setSelectedProvider(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white outline-none focus:border-indigo-500"
          >
            <option value="auto">Auto-Select (Gemini 2.0 / Claude 3.5)</option>
            <option value="gemini">Google Gemini AI</option>
            <option value="claude">Anthropic Claude AI</option>
          </select>
        </div>
      </div>

      {/* Autonomous Action Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Autonomous Action Stream & Optimization Trail
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live chronological trace of actions executed automatically by the agent bot.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Cycle #{agentState.currentCycle} • Last run {new Date(agentState.lastRunAt || Date.now()).toLocaleTimeString()}
          </span>
        </div>

        <div className="space-y-3">
          {agentState.actionsHistory.map((act: any) => (
            <div
              key={act.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{act.title}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {act.category}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                      +{act.impactScore} Score Boost
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.detail}</p>
                </div>
              </div>

              <div className="text-right shrink-0 text-slate-400 text-[11px] font-medium flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-emerald-600 font-bold text-[10px]">EXECUTED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
