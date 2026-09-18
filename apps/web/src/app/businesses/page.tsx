'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Star,
  ExternalLink,
  CheckCircle2,
  FileCheck2,
  Trash2,
  Globe,
} from 'lucide-react';
import { BusinessProfile } from '@localrank/types';
import { COUNTRIES, GOOGLE_CATEGORIES } from '@/data/geoAndCategories';

export default function BusinessesPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New business form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('Sri Lanka');
  const [city, setCity] = useState('Colombo');
  const [phone, setPhone] = useState('+94 11 000 0000');
  const [website, setWebsite] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState('Dentist');
  const [submitting, setSubmitting] = useState(false);

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const found = COUNTRIES.find((c) => c.name === newCountry);
    if (found) {
      if (found.cities.length > 0) {
        setCity(found.cities[0]);
      }
      setPhone(`${found.phoneCode} `);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await fetch('/api/businesses');
      const data = await res.json();
      if (data.businesses) setBusinesses(data.businesses);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          address: address.trim(),
          phone: phone.trim(),
          website: website.trim(),
          primaryCategory: primaryCategory.trim(),
          city: city.trim(),
          country: country.trim(),
        }),
      });
      const data = await res.json();
      if (data.business) {
        setBusinesses([data.business, ...businesses]);
        setShowModal(false);
        // Reset form
        setName('');
        setAddress('');
        setPhone('+94 11 000 0000');
        setWebsite('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectAndAudit = async (biz: BusinessProfile) => {
    await fetch(`/api/businesses/${biz.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    router.push('/audits');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Building2 className="w-3.5 h-3.5" />
            BUSINESS PORTFOLIO
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Managed Google Business Profiles
          </h1>
          <p className="text-xs text-slate-500">
            Create, audit, and track multiple client profiles across agency locations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Business
        </button>
      </div>

      {/* Businesses Grid */}
      {businesses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No businesses yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your first business or Google Maps location to begin your initial local SEO audit.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
          >
            Add Business
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz) => (
            <div
              key={biz.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {biz.primaryCategory || 'Local Business'}
                  </span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {biz.rating || 4.5} ({biz.reviewCount || 0})
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{biz.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{biz.address || biz.city || 'Colombo, Sri Lanka'}</span>
                </p>
                {biz.phone && (
                  <p className="text-xs text-slate-600 font-mono">{biz.phone}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSelectAndAudit(biz)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  Audit Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Business Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Business</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audit an existing profile or track a local business.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Google Business Profile External Creation Notice */}
            <div className="mx-6 mt-5 p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  Need to publish on Google Maps first?
                </span>
                <a
                  href={
                    name
                      ? `https://business.google.com/create?name=${encodeURIComponent(name)}`
                      : 'https://business.google.com/create'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 hover:border-indigo-300 shadow-2xs transition-colors shrink-0"
                >
                  Create on Google <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Google requires official owner verification (postcard/video/SMS) before publishing to Maps. After registering, add its details below to audit its local SEO signals.
              </p>
            </div>

            <form onSubmit={handleCreateBusiness} className="p-6 pt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Health Clinic"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              {/* Primary Category with full Google Category List */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Primary Category *
                  </label>
                  <span className="text-[10px] text-indigo-600 font-semibold">
                    Google Business Profile List ({GOOGLE_CATEGORIES.length}+)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  list="gbp-categories-list"
                  value={primaryCategory}
                  onChange={(e) => setPrimaryCategory(e.target.value)}
                  placeholder="Type to search e.g. Dentist, Doctor, Restaurant, Plumber..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 bg-white"
                />
                <datalist id="gbp-categories-list">
                  {GOOGLE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                {/* Popular category quick chips */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {['Dentist', 'Restaurant', 'Plumber', 'Doctor', 'Auto Repair Shop', 'Law Firm'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setPrimaryCategory(chip)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                        primaryCategory === chip
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country and City / Area Auto-List */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 bg-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.phoneCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      City / Area
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Auto-suggests
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    list="city-suggestions-list"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Type or select city/area"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 bg-white"
                  />
                  <datalist id="city-suggestions-list">
                    {COUNTRIES.find((c) => c.name === country)?.cities.map((cityOption) => (
                      <option key={cityOption} value={cityOption} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 100 Main Street, Suite 4B"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              {/* Phone and Website */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 11 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add & Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
