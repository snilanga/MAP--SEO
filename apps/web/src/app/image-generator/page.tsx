'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  MapPin,
  Building2,
  CheckCircle2,
  Palette,
  Layers,
  Star,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { BusinessProfile } from '@localrank/types';

interface DesignTheme {
  id: string;
  name: string;
  bgGradStart: string;
  bgGradEnd: string;
  accent: string;
  textLight: string;
}

const THEMES: DesignTheme[] = [
  {
    id: 'dental-clean',
    name: 'Medical / Dental Cyan',
    bgGradStart: '#0f172a',
    bgGradEnd: '#1e3a8a',
    accent: '#38bdf8',
    textLight: '#ffffff',
  },
  {
    id: 'auto-dark',
    name: 'Automotive Performance',
    bgGradStart: '#18181b',
    bgGradEnd: '#27272a',
    accent: '#f59e0b',
    textLight: '#ffffff',
  },
  {
    id: 'dining-warm',
    name: 'Dining & Culinary Gold',
    bgGradStart: '#450a0a',
    bgGradEnd: '#7f1d1d',
    accent: '#fbbf24',
    textLight: '#ffffff',
  },
  {
    id: 'agency-violet',
    name: 'Modern Agency Indigo',
    bgGradStart: '#1e1b4b',
    bgGradEnd: '#3730a3',
    accent: '#a5b4fc',
    textLight: '#ffffff',
  },
  {
    id: 'emerald-wellness',
    name: 'Emerald Health & Trades',
    bgGradStart: '#064e3b',
    bgGradEnd: '#065f46',
    accent: '#34d399',
    textLight: '#ffffff',
  },
];

export default function ImageGeneratorPage() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile | null>(null);
  const [theme, setTheme] = useState<DesignTheme>(THEMES[0]);
  const [headline, setHeadline] = useState('Gentle & Pain-Free Dental Care');
  const [subhead, setSubhead] = useState('Top-Rated Family & Cosmetic Dentistry in Colombo 03');
  const [badgeText, setBadgeText] = useState('★ 4.7 RATED (240+ REVIEWS)');
  const [format, setFormat] = useState<'cover' | 'square'>('cover');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetch('/api/businesses')
      .then((r) => r.json())
      .then((data) => {
        if (data.businesses) {
          setBusinesses(data.businesses);
          const active = data.currentBusiness || data.businesses[0];
          if (active) {
            setCurrentBusiness(active);
            updateDefaultsForBusiness(active);
          }
        }
      });
  }, []);

  const updateDefaultsForBusiness = (biz: BusinessProfile) => {
    const cat = biz.primaryCategory?.toLowerCase() || '';
    if (cat.includes('auto')) {
      setTheme(THEMES[1]);
      setHeadline('Hybrid & Mechanical Diagnostics');
      setSubhead('Fast, Reliable Automotive Maintenance in Colombo 09');
      setBadgeText('★ 4.9 RATED • CALL TODAY');
    } else if (cat.includes('rest') || cat.includes('food')) {
      setTheme(THEMES[2]);
      setHeadline('Authentic Ceylon Dining & Courtyard');
      setSubhead('Fresh Seafood Curries & Tropical Courtyard Dining');
      setBadgeText('AWARD WINNING CUISINE');
    } else {
      setTheme(THEMES[0]);
      setHeadline(`Welcome to ${biz.name}`);
      setSubhead(`Premier ${biz.primaryCategory || 'Services'} in ${biz.city || 'Colombo'}`);
      setBadgeText(`★ ${biz.rating || 4.7} RATED ON GOOGLE`);
    }
  };

  const handleSelectBusiness = (bizId: string) => {
    const found = businesses.find((b) => b.id === bizId);
    if (found) {
      setCurrentBusiness(found);
      updateDefaultsForBusiness(found);
    }
  };

  // Draw on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = format === 'cover' ? 1200 : 1080;
    const height = format === 'cover' ? 675 : 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, theme.bgGradStart);
    grad.addColorStop(1, theme.bgGradEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative geometric accents
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.2, height * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.85, height * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // 3. Category & Promo Badge
    const badgeY = height * 0.22;
    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillText(badgeText.toUpperCase(), 80, badgeY);

    // 4. Headline
    ctx.fillStyle = theme.textLight;
    ctx.font = 'bold 54px -apple-system, sans-serif';
    ctx.fillText(headline, 80, badgeY + 70);

    // 5. Subheadline
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'normal 28px -apple-system, sans-serif';
    ctx.fillText(subhead, 80, badgeY + 125);

    // 6. Business Footer with NAP & Geotags
    const footerY = height - 110;
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, footerY - 30, width, 140);

    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 30px -apple-system, sans-serif';
    ctx.fillText(currentBusiness?.name || 'Local Business', 80, footerY + 20);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'normal 22px -apple-system, sans-serif';
    const addressStr = currentBusiness?.address || 'Colombo, Sri Lanka';
    const phoneStr = currentBusiness?.phone ? ` • ${currentBusiness.phone}` : '';
    ctx.fillText(`${addressStr}${phoneStr}`, 80, footerY + 60);

    // Coordinates Tag (Top Right)
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'mono 18px monospace';
    const lat = currentBusiness?.latitude || 6.9015;
    const lng = currentBusiness?.longitude || 79.8529;
    ctx.fillText(`GPS [${lat.toFixed(4)}, ${lng.toFixed(4)}]`, width - 300, 60);
  }, [theme, headline, subhead, badgeText, format, currentBusiness]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${(currentBusiness?.name || 'gbp-photo')
      .toLowerCase()
      .replace(/\s+/g, '-')}-asset.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <ImageIcon className="w-3.5 h-3.5" />
              GBP LOCAL SEO ASSET STUDIO
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Google Business Profile Image Generator
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Generate branded, high-CTR promotional cover graphics and square post banners. Pre-formatted to Google&apos;s exact 1200x675 / 1080x1080 specifications with simulated geotag coordinates.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-indigo-50/80 border border-indigo-200 px-4 py-3 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
            <div>
              <div className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide">
                Unlimited Image Generator
              </div>
              <div className="text-[11px] text-indigo-700 font-medium">
                High-Res PNG Export (100% Free)
              </div>
            </div>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
          <div className="space-y-4 lg:col-span-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Business Profile
              </label>
              <select
                value={currentBusiness?.id || ''}
                onChange={(e) => handleSelectBusiness(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white outline-none focus:border-indigo-500"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.primaryCategory})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Image Format & Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('cover')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                    format === 'cover'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Cover (16:9)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('square')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                    format === 'square'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Post (1:1 Square)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Design Color Theme
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                      theme.id === t.id
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.name}</span>
                    <div
                      className="w-4 h-4 rounded-full border border-slate-300"
                      style={{ background: t.accent }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Promo / Rating Badge
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subheading / Value Prop
              </label>
              <input
                type="text"
                value={subhead}
                onChange={(e) => setSubhead(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 bg-white"
              />
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download High-Res PNG
            </button>
          </div>

          {/* Canvas Live Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live Studio Canvas Preview
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {format === 'cover' ? '1200 × 675 px (Optimal GBP Banner)' : '1080 × 1080 px (Square Post)'}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-lg bg-slate-950 flex items-center justify-center p-2">
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-xl object-contain shadow-md"
              />
            </div>

            {/* Geotag Simulation Info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>
                  Simulated Geotags: <strong>{currentBusiness?.city || 'Colombo'}, Sri Lanka</strong> [{currentBusiness?.latitude || 6.9015}, {currentBusiness?.longitude || 79.8529}]
                </span>
              </div>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                SEO Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
