import React from 'react';
import type { ConfinementLevel } from '../../types';

interface ConfinementSelectorProps {
  value: ConfinementLevel;
  onChange: (level: ConfinementLevel) => void;
}

const levels: { key: ConfinementLevel; desc: string }[] = [
  { key: '1D', desc: 'Pipe / Duct' },
  { key: '2D', desc: 'Tunnel / Platform' },
  { key: '2.5D', desc: 'Partially confined' },
  { key: '3D', desc: 'Open area' },
];

export const ConfinementSelector: React.FC<ConfinementSelectorProps> = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-300">Confinement Level</label>
    <div className="flex gap-2">
      {levels.map((l) => (
        <button
          key={l.key}
          onClick={() => onChange(l.key)}
          className={`flex-1 px-2 py-2 rounded text-sm border transition-colors ${
            value === l.key
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
          }`}
        >
          <div className="font-medium">{l.key}</div>
          <div className="text-xs opacity-70">{l.desc}</div>
        </button>
      ))}
    </div>
  </div>
);
