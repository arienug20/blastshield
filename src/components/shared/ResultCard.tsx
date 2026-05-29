import React from 'react';

interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, unit, highlight }) => (
  <div className={`rounded-lg p-3 ${highlight ? 'bg-blue-900/40 border border-blue-600' : 'bg-gray-700/50 border border-gray-600'}`}>
    <div className="text-xs text-gray-400 mb-1">{label}</div>
    <div className="text-lg font-mono font-semibold text-yellow-400">
      {typeof value === 'number' ? value.toFixed(4) : value}
      {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
    </div>
  </div>
);
