import React, { useState } from 'react';
import { useVCEStore } from '../store';
import { fuelLibrary } from '../data/fuel-library';
import { runBSTAnalysis } from '../core/baker-strehlow';
import { runTNTAnalysis } from '../core/tnt-equivalent';
import { runTNOAnalysis } from '../core/tno-multi-energy';
import type { BSTOutput, TNTOutput, TNOOutput, ConfinementLevel, CongestionLevel } from '../types';
import { NumberInput } from '../components/shared/NumberInput';
import { ResultCard } from '../components/shared/ResultCard';
import { MethodToggle } from '../components/shared/MethodToggle';
import { FuelSelector } from '../components/vce/FuelSelector';
import { ConfinementSelector } from '../components/vce/ConfinementSelector';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Method = 'bst' | 'tnt' | 'tno' | 'all';

export const VceCalculator: React.FC = () => {
  const {
    fuelId, flammableMass, confinement, congestion, standoffDistance,
    activeMethod, bstResult, tntResult, tnoResult,
    setFuelId, setFlammableMass, setConfinement, setCongestion,
    setStandoffDistance, setActiveMethod, runAllAnalyses
  } = useVCEStore();

  const [chartData, setChartData] = useState<Array<{ distance: number; bst: number | null; tnt: number | null; tno: number | null }>>([]);

  const handleCalculate = () => {
    runAllAnalyses();
    generateChartData();
  };

  const generateChartData = () => {
    const fuel = fuelLibrary.find((f) => f.id === fuelId) || fuelLibrary[0];
    const distances = [10, 20, 30, 50, 75, 100, 150, 200, 300, 500];
    const data = distances.map((d) => {
      let bst: number | null = null;
      let tnt: number | null = null;
      let tno: number | null = null;
      try {
        bst = runBSTAnalysis(fuelId, flammableMass, confinement, congestion, d, 1.013, 293).peakOverpressure;
      } catch {}
      try {
        tnt = runTNTAnalysis(flammableMass, fuel.heatOfCombustion, 0.10, d, 1.013).peakOverpressure;
      } catch {}
      try {
        tno = runTNOAnalysis(5, 1000, d, 1.013).peakOverpressure;
      } catch {}
      return { distance: d, bst, tnt, tno };
    });
    setChartData(data);
  };

  const showBST = activeMethod === 'all' || activeMethod === 'bst';
  const showTNT = activeMethod === 'all' || activeMethod === 'tnt';
  const showTNO = activeMethod === 'all' || activeMethod === 'tno';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">VCE Calculator</h1>

      {/* Input Panel */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Input Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FuelSelector value={fuelId} onChange={setFuelId} />
          <NumberInput label="Flammable Mass" unit="kg" value={flammableMass} onChange={setFlammableMass} min={0} step={100} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConfinementSelector value={confinement} onChange={setConfinement} />
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Congestion Level</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as CongestionLevel[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCongestion(c)}
                  className={`flex-1 px-3 py-2 rounded text-sm border capitalize transition-colors ${
                    congestion === c ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput label="Standoff Distance" unit="m" value={standoffDistance} onChange={setStandoffDistance} min={0} step={1} />
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Analysis Method</label>
            <MethodToggle value={activeMethod} onChange={setActiveMethod} />
          </div>
        </div>
        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg transition-colors"
        >
          Run Analysis
        </button>
      </div>

      {/* Results */}
      {(bstResult || tntResult || tnoResult) && (
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Results</h2>

          {showBST && bstResult && (
            <ResultSection title="BST Method" result={bstResult} type="bst" />
          )}
          {showTNT && tntResult && (
            <ResultSection title="TNT Equivalent" result={tntResult} type="tnt" />
          )}
          {showTNO && tnoResult && (
            <ResultSection title="TNO Multi-Energy" result={tnoResult} type="tno" />
          )}
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Pressure vs Distance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="distance" label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }} stroke="#9CA3AF" />
              <YAxis label={{ value: 'Overpressure (bar)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Legend />
              {showBST && <Line type="monotone" dataKey="bst" stroke="#3b82f6" name="BST" connectNulls dot />}
              {showTNT && <Line type="monotone" dataKey="tnt" stroke="#ef4444" name="TNT" connectNulls dot />}
              {showTNO && <Line type="monotone" dataKey="tno" stroke="#22c55e" name="TNO" connectNulls dot />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const ResultSection: React.FC<{ title: string; result: BSTOutput | TNTOutput | TNOOutput; type: string }> = ({ title, result, type }) => (
  <div className="border border-gray-700 rounded-lg p-4">
    <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <ResultCard label="Peak Overpressure" value={result.peakOverpressure} unit="bar" highlight />
      <ResultCard label="Impulse" value={result.positivePhaseImpulse} unit="bar·ms" />
      <ResultCard label="Duration" value={result.positivePhaseDuration} unit="ms" />
      {type === 'bst' && 'flameSpeed' in result && (
        <ResultCard label="Flame Speed" value={(result as BSTOutput).flameSpeed} unit="Mach" />
      )}
      {type === 'tnt' && 'tntEquivalentMass' in result && (
        <ResultCard label="TNT Equivalent" value={(result as TNTOutput).tntEquivalentMass} unit="kg" />
      )}
      {type === 'tno' && 'sourceStrength' in result && (
        <ResultCard label="Source Strength" value={(result as TNOOutput).sourceStrength} unit="" />
      )}
    </div>
  </div>
);
