import React from 'react';
import { AuditStatus, ConsistencyStatus } from '@localrank/types';
import { CheckCircle2, AlertTriangle, XCircle, Info, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: AuditStatus | ConsistencyStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSmall = size === 'sm';

  switch (status) {
    case 'PASS':
    case 'MATCH':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${
            isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <CheckCircle2 className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {status}
        </span>
      );

    case 'WARNING':
    case 'PARTIAL MATCH':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${
            isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <AlertTriangle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {status}
        </span>
      );

    case 'ERROR':
    case 'MISMATCH':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${
            isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <XCircle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {status}
        </span>
      );

    case 'INFO':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${
            isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Info className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          INFO
        </span>
      );

    case 'NOT_AVAILABLE':
    case 'NOT AVAILABLE':
    case 'NOT FOUND':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${
            isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <HelpCircle className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {status === 'NOT_AVAILABLE' ? 'NOT AVAILABLE' : status}
        </span>
      );
  }
};
