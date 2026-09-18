'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Building2,
  RefreshCw,
  Plus,
  ShieldCheck,
  ChevronDown,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { BusinessProfile } from '@localrank/types';

export const TopBar: React.FC = () => {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile | null>(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  useEffect(() => {
    fetch('/api/businesses')
      .then((res) => res.json())
      .then((data) => {
        if (data.businesses) setBusinesses(data.businesses);
        if (data.currentBusiness) setCurrentBusiness(data.currentBusiness);
      })
      .catch(() => {});
  }, []);

  const handleSelectBusiness = async (bizId: string) => {
    const selected = businesses.find((b) => b.id === bizId);
    if (!selected) return;
    setCurrentBusiness(selected);
    await fetch(`/api/businesses/${bizId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    router.refresh();
  };

  const handleTriggerAudit = async () => {
    setIsLoadingAudit(true);
    try {
      await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business: currentBusiness }),
      });
      router.push('/audits');
      router.refresh();
    } catch {
      // error handled
    } finally {
      setIsLoadingAudit(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Home Navigation & Active Business Selector */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold transition-all shadow-2xs group"
          title="Back to Dashboard Home"
        >
          <Home className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <select
                className="bg-transparent font-bold cursor-pointer text-slate-900 outline-none text-xs"
                value={currentBusiness?.id || ''}
                onChange={(e) => handleSelectBusiness(e.target.value)}
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city || 'Colombo'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Source Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3 h-3" />
          Source: {currentBusiness?.dataSource || 'Google Business Profile'}
        </div>
      </div>

      {/* Right Controls: Audit trigger, notifications, user avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleTriggerAudit}
          disabled={isLoadingAudit}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-600/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAudit ? 'animate-spin' : ''}`} />
          {isLoadingAudit ? 'Running Audit...' : 'Run Audit'}
        </button>

        <button
          onClick={() => router.push('/businesses?action=new')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          Add Business
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* Notification bell */}
        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
        </button>

        {/* User profile avatar */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-100">
            NL
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <div className="text-xs font-semibold text-slate-800">Agency Admin</div>
            <div className="text-[10px] text-slate-500">Nilanga</div>
          </div>
        </div>
      </div>
    </header>
  );
};
