import React, { useState } from 'react';
import {
  FileCheck2,
  FileText,
} from 'lucide-react';

export const SidePanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const business = {
    name: 'ABC Dental Clinic',
    category: 'Dentist',
    rating: 4.7,
    reviews: 247,
    website: 'https://abcdentalcolombo.example.com',
    score: 82,
    source: 'Google Maps public information',
  };

  const sections = [
    { id: 'profile', label: 'Profile', score: '88%', status: 'PASS' },
    { id: 'website', label: 'Website', score: '75%', status: 'WARNING' },
    { id: 'reviews', label: 'Reviews', score: '91%', status: 'PASS' },
    { id: 'categories', label: 'Categories', score: '85%', status: 'PASS' },
    { id: 'content', label: 'Content', score: '80%', status: 'PASS' },
    { id: 'media', label: 'Media', score: '70%', status: 'WARNING' },
    { id: 'localseo', label: 'Local SEO', score: '60%', status: 'ERROR' },
    { id: 'competitors', label: 'Competitors', score: 'Gap found', status: 'INFO' },
  ];

  const openWeb = (path: string) => {
    const url = `http://localhost:3000${path}`;
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div
      style={{
        padding: '18px',
        color: '#0f172a',
        background: '#ffffff',
        minHeight: '100vh',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Business Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#a5b4fc',
                textTransform: 'uppercase',
              }}
            >
              {business.category}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 6px 0' }}>
              {business.name}
            </h2>
            <div style={{ fontSize: '11px', color: '#c7d2fe', display: 'flex', gap: '8px' }}>
              <span>★ {business.rating}</span>
              <span>•</span>
              <span>{business.reviews} Reviews</span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              padding: '8px 12px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff' }}>
              {business.score}
            </div>
            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: '#c7d2fe' }}>
              / 100
            </div>
          </div>
        </div>

        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', color: '#a5b4fc' }}>
          Source: {business.source}
        </div>
      </div>

      {/* Audit Sections (Requirement 6) */}
      <div style={{ marginTop: '18px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
          Audit Dimensions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {sections.map((sec) => (
            <div
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                background: activeSection === sec.id ? '#eef2ff' : '#f8fafc',
                border: activeSection === sec.id ? '1px solid #818cf8' : '1px solid #e2e8f0',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>{sec.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                  {sec.score}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '2px 5px',
                    borderRadius: '4px',
                    background:
                      sec.status === 'PASS'
                        ? '#d1fae5'
                        : sec.status === 'WARNING'
                        ? '#fef3c7'
                        : sec.status === 'ERROR'
                        ? '#fee2e2'
                        : '#e2e8f0',
                    color:
                      sec.status === 'PASS'
                        ? '#065f46'
                        : sec.status === 'WARNING'
                        ? '#92400e'
                        : sec.status === 'ERROR'
                        ? '#991b1b'
                        : '#334155',
                  }}
                >
                  {sec.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons (Requirement 6) */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => openWeb('/audits')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '11px',
            borderRadius: '8px',
            background: '#4f46e5',
            color: '#ffffff',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
          }}
        >
          <FileCheck2 size={16} /> View Full Audit in Dashboard
        </button>

        <button
          onClick={() => openWeb('/reports')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <FileText size={15} color="#4f46e5" /> Generate PDF Report
        </button>
      </div>
    </div>
  );
};
