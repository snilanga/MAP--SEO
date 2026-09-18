import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  Globe,
  Star,
  Users2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const Popup: React.FC = () => {
  const [businessName, setBusinessName] = useState('ABC Dental Clinic');
  const [source, setSource] = useState('Google Maps');
  const [rating, setRating] = useState('4.7 (247 reviews)');

  useEffect(() => {
    // Try to get detected business from current active tab or storage
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: 'GET_DETECTED_BUSINESS' },
            (response) => {
              if (response?.data) {
                setBusinessName(response.data.name);
                setSource(response.data.source || 'Google Maps');
                if (response.data.rating) {
                  setRating(`${response.data.rating} ★`);
                }
              }
            }
          );
        }
      });
    }
  }, []);

  const openWeb = (path: string) => {
    const url = `http://localhost:3000${path}`;
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div style={{ padding: '16px', color: '#0f172a', background: '#ffffff', minHeight: '380px' }}>
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '12px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#4f46e5',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            LR
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
              LocalRank Audit
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>GBP Assistant</div>
          </div>
        </div>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            background: '#e0e7ff',
            color: '#4338ca',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          ACTIVE
        </span>
      </div>

      {/* Current Detected Business */}
      <div
        style={{
          marginTop: '12px',
          padding: '12px',
          borderRadius: '10px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
          Current Business
        </div>
        <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginTop: '2px' }}>
          {businessName}
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Source: {source}</span>
          <span>{rating}</span>
        </div>
      </div>

      {/* Audit Actions (Requirement 6) */}
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => openWeb('/audits')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: '8px',
            background: '#4f46e5',
            color: '#ffffff',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck2 size={16} /> Run GBP Audit
          </span>
          <ChevronRight size={14} />
        </button>

        <button
          onClick={() => openWeb('/website-audits')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 14px',
            borderRadius: '8px',
            background: '#ffffff',
            color: '#334155',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={15} color="#4f46e5" /> Website Audit
          </span>
          <ChevronRight size={14} color="#94a3b8" />
        </button>

        <button
          onClick={() => openWeb('/reviews')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 14px',
            borderRadius: '8px',
            background: '#ffffff',
            color: '#334155',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={15} color="#f59e0b" /> Review Audit
          </span>
          <ChevronRight size={14} color="#94a3b8" />
        </button>

        <button
          onClick={() => openWeb('/competitors')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 14px',
            borderRadius: '8px',
            background: '#ffffff',
            color: '#334155',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users2 size={15} color="#059669" /> Competitor Audit
          </span>
          <ChevronRight size={14} color="#94a3b8" />
        </button>
      </div>

      {/* Open Dashboard Link */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
        <button
          onClick={() => openWeb('/')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#4f46e5',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Open Dashboard <ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
};
