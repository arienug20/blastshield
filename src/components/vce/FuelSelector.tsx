import React from 'react';
import { fuelLibrary } from '../../data/fuel-library';

interface FuelSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

export const FuelSelector: React.FC<FuelSelectorProps> = ({ value, onChange }) => {
  const selectedFuel = fuelLibrary.find((f) => f.id === value);

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-300">Fuel Type</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
      >
        {fuelLibrary.map((fuel) => (
          <option key={fuel.id} value={fuel.id}>
            {fuel.name} ({fuel.formula})
          </option>
        ))}
      </select>
      {selectedFuel && (
        <div className="mt-1 text-xs text-gray-500">
          Hc: {selectedFuel.heatOfCombustion} kJ/kg | Sl: {selectedFuel.laminarBurningVelocity} m/s | Reactivity: {selectedFuel.reactivityClass}
        </div>
      )}
    </div>
  );
};
