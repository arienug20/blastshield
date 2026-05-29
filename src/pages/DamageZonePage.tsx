import React, { useState, useMemo } from 'react';
import { buildingDamageThresholds } from '../data/damage-thresholds';
import { NumberInput } from '../components/shared/NumberInput';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const DamageZonePage: React.FC = () => {
  const [peakPressure, setPeakPressure] = useState(0.5);
  const [distance, setDistance] = useState(100);

  const chartData = useMemo(() => {
    // Simple inverse-distance model for visualization
    const points = [];
    for (let d = 5; d <= distance; d += 2) {
      const p = peakPressure * (10 / d) ** 1.5;
      points.push({ distance: d, overpressure: Math.min(p, 10) });
    }
    return points;
  }, [peakPressure, distance]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Damage Zones</h1>

      {/* Damage Thresholds Table */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Building Damage Thresholds</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-400">Level</th>
                <th className="text-left py-2 px-3 text-gray-400">Overpressure (bar)</th>
                <th className="text-left py-2 px-3 text-gray-400">Description</th>
              </tr>
            </thead>
            <tbody>
              {buildingDamageThresholds.map((t, i) => (
                <tr key={i} className="border-b border-gray-700/50">
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.level}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-yellow-400">{t.overpressure}</td>
                  <td className="py-2 px-3 text-gray-300">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safe Distance Calculator */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Safe Distance Estimator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput label="Reference Peak Pressure" unit="bar" value={peakPressure} onChange={setPeakPressure} min={0.001} step={0.01} />
          <NumberInput label="Max Distance" unit="m" value={distance} onChange={setDistance} min={10} step={10} />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Distance vs Overpressure</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="distance" label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }} stroke="#9CA3AF" />
            <YAxis label={{ value: 'Overpressure (bar)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="overpressure" stroke="#f59e0b" dot={false} strokeWidth={2} />
            {buildingDamageThresholds.map((t, i) => (
              <ReferenceLine key={i} y={t.overpressure} stroke={t.color} strokeDasharray="5 5" label={{ value: t.level, fill: t.color, fontSize: 10 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Damage Zone Visualization */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Damage Zone Bands</h2>
        <div className="space-y-1">
          {buildingDamageThresholds.slice(0).reverse().map((t, i, arr) => {
            const nextThreshold = i < arr.length - 1 ? arr[i + 1] : null;
            const label = nextThreshold
              ? `${nextThreshold.overpressure} – ${t.overpressure} bar`
              : `< ${t.overpressure} bar`;
            return (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: t.color, opacity: 0.7 }} />
                <div className="flex-1">
                  <span className="font-medium text-white">{t.level}</span>
                  <span className="text-gray-400 text-sm ml-3">{label}</span>
                </div>
                <span className="text-gray-500 text-sm">{t.description}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
