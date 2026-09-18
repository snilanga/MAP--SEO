'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  FileCheck2,
  Globe,
  Star,
  Tags,
  Users2,
  MapPin,
  FileText,
  Activity,
  Settings,
  Sparkles,
  Compass,
  Image as ImageIcon,
  Bot,
  Share2,
  Target,
  Layers,
  Code2,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Full Auto Agent Bot', href: '/agent-bot', icon: Bot },
  { label: 'Businesses', href: '/businesses', icon: Building2 },
  { label: 'GBP Audit', href: '/audits', icon: FileCheck2 },
  { label: 'Website Audit', href: '/website-audits', icon: Globe },
  { label: 'Review Audit', href: '/reviews', icon: Star },
  { label: 'Category Finder', href: '/categories', icon: Tags },
  { label: 'Teleport Simulator', href: '/teleport', icon: Compass },
  { label: 'Local Scan (Grid)', href: '/rank-tracker', icon: MapPin },
  { label: 'GBP Image Studio', href: '/image-generator', icon: ImageIcon },
  { label: 'Competitors', href: '/competitors', icon: Users2 },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'Monitoring', href: '/monitoring', icon: Activity },
  { label: 'Settings', href: '/settings', icon: Settings },
];

const META_NAV_ITEMS = [
  { label: 'Meta Pixel Setup', href: '/meta/pixel', icon: Target },
  { label: 'Facebook Integration', href: '/meta/facebook', icon: Share2 },
  { label: 'Open Graph Preview', href: '/meta/open-graph', icon: Globe },
  { label: 'Tracking Events', href: '/meta/events', icon: Layers },
  { label: 'WordPress Connect', href: '/meta/wordpress', icon: Code2 },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
          LR
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            LocalRank Audit
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              UNLIMITED
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Local SEO Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Auditing & Optimization
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Meta & Facebook Section */}
        <div className="pt-3 pb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Meta & Facebook</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            NEW
          </span>
        </div>
        {META_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Unlimited Pro License Badge */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center justify-between">
          <span className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Unlimited Agency Pro
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-[9px]">
            ACTIVE
          </span>
        </div>
        <div className="text-[10px] text-slate-400 px-1 space-y-0.5">
          <div className="flex items-center justify-between">
            <span>Audit & Scan Views:</span>
            <span className="font-bold text-emerald-400">∞ Unlimited</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Gemini / Claude AI:</span>
            <span className="font-bold text-emerald-400">∞ Unlimited</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Teleport & Images:</span>
            <span className="font-bold text-emerald-400">∞ Unlimited</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
