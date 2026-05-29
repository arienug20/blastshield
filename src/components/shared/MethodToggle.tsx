import React from 'react';

type Method = 'bst' | 'tnt' | 'tno' | 'all';

interface MethodToggleProps {
  value: Method;
  onChange: (method: Method) => void;
}

const methods: { key: Method; label: string }[] = [
  { key: 'bst', label: 'BST' },
  { key: 'tnt', label: 'TNT' },
  { key: 'tno', label: 'TNO' },
  { key: 'all', label: 'All' },
];

export const MethodToggle: React.FC<MethodToggleProps> = ({ value, onChange }) => (
  <div className="flex gap-1 bg-gray-700 rounded-lg p-1">
    {methods.map((m) => (
      <button
        key={m.key}
        onClick={() => onChange(m.key)}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          value === m.key
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        {m.label}
      </button>
    ))}
  </div>
);
