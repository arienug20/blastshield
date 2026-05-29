import React from 'react';
import { useVCEStore } from './store';
import { fuelLibrary } from './data/fuel-library';
import { ConfinementLevel, CongestionLevel } from './types';

function App() {
  const {
    fuelId,
    flammableMass,
    confinement,
    congestion,
    standoffDistance,
    bstResult,
    tntResult,
    tnoResult,
    activeMethod,
    setFuelId,
    setFlammableMass,
    setConfinement,
    setCongestion,
    setStandoffDistance,
    setActiveMethod,
    runAllAnalyses
  } = useVCEStore();

  const handleRunAnalysis = () => {
    runAllAnalyses();
  };

  const getDisplayResult = () => {
    switch (activeMethod) {
      case 'bst':
        return bstResult;
      case 'tnt':
        return tntResult;
      case 'tno':
        return tnoResult;
      case 'all':
        return { bst: bstResult, tnt: tntResult, tno: tnoResult };
      default:
        return null;
    }
  };

  const result = getDisplayResult();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">BlastShield</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">VCE Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fuel Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Fuel Type</label>
              <select
                value={fuelId}
                onChange={(e) => setFuelId(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                {fuelLibrary.map(fuel => (
                  <option key={fuel.id} value={fuel.id}>{fuel.name}</option>
                ))}
              </select>
            </div>

            {/* Flammable Mass */}
            <div>
              <label className="block text-sm font-medium mb-2">Flammable Mass (kg)</label>
              <input
                type="number"
                value={flammableMass}
                onChange={(e) => setFlammableMass(Number(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>

            {/* Confinement */}
            <div>
              <label className="block text-sm font-medium mb-2">Confinement Level</label>
              <select
                value={confinement}
                onChange={(e) => setConfinement(e.target.value as ConfinementLevel)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="1D">1D</option>
                <option value="2D">2D</option>
                <option value="2.5D">2.5D</option>
                <option value="3D">3D</option>
              </select>
            </div>

            {/* Congestion */}
            <div>
              <label className="block text-sm font-medium mb-2">Congestion Level</label>
              <select
                value={congestion}
                onChange={(e) => setCongestion(e.target.value as CongestionLevel)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Standoff Distance */}
            <div>
              <label className="block text-sm font-medium mb-2">Standoff Distance (m)</label>
              <input
                type="number"
                value={standoffDistance}
                onChange={(e) => setStandoffDistance(Number(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>

            {/* Method Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Analysis Method</label>
              <select
                value={activeMethod}
                onChange={(e) => setActiveMethod(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="bst">BST Method</option>
                <option value="tnt">TNT Equivalent</option>
                <option value="tno">TNO Multi-Energy</option>
                <option value="all">All Methods</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRunAnalysis}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
          >
            Run Analysis
          </button>
        </div>

        {/* Results Display */}
        {result && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Results</h2>
            
            {activeMethod === 'all' ? (
              <div className="space-y-4">
                {/* BST Result */}
                {bstResult && (
                  <div className="border border-gray-700 rounded p-4">
                    <h3 className="text-lg font-medium mb-2">BST Method</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Peak Overpressure: <span className="font-mono text-yellow-400">{bstResult.peakOverpressure.toFixed(4)} bar</span></div>
                      <div>Flame Speed: <span className="font-mono text-yellow-400">{bstResult.flameSpeed.toFixed(3)} Mach</span></div>
                      <div>Impulse: <span className="font-mono text-yellow-400">{bstResult.positivePhaseImpulse.toFixed(3)} bar·ms</span></div>
                      <div>Duration: <span className="font-mono text-yellow-400">{bstResult.positivePhaseDuration.toFixed(2)} ms</span></div>
                    </div>
                  </div>
                )}

                {/* TNT Result */}
                {tntResult && (
                  <div className="border border-gray-700 rounded p-4">
                    <h3 className="text-lg font-medium mb-2">TNT Equivalent</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>TNT Equivalent: <span className="font-mono text-yellow-400">{tntResult.tntEquivalentMass.toFixed(2)} kg</span></div>
                      <div>Peak Overpressure: <span className="font-mono text-yellow-400">{tntResult.peakOverpressure.toFixed(4)} bar</span></div>
                      <div>Impulse: <span className="font-mono text-yellow-400">{tntResult.positivePhaseImpulse.toFixed(3)} bar·ms</span></div>
                      <div>Duration: <span className="font-mono text-yellow-400">{tntResult.positivePhaseDuration.toFixed(2)} ms</span></div>
                    </div>
                  </div>
                )}

                {/* TNO Result */}
                {tnoResult && (
                  <div className="border border-gray-700 rounded p-4">
                    <h3 className="text-lg font-medium mb-2">TNO Multi-Energy</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Source Strength: <span className="font-mono text-yellow-400">{tnoResult.sourceStrength}</span></div>
                      <div>Peak Overpressure: <span className="font-mono text-yellow-400">{tnoResult.peakOverpressure.toFixed(4)} bar</span></div>
                      <div>Impulse: <span className="font-mono text-yellow-400">{tnoResult.positivePhaseImpulse.toFixed(3)} bar·ms</span></div>
                      <div>Duration: <span className="font-mono text-yellow-400">{tnoResult.positivePhaseDuration.toFixed(2)} ms</span></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {activeMethod === 'bst' && bstResult && (
                  <>
                    <div>Peak Overpressure: <span className="font-mono text-yellow-400">{bstResult.peakOverpressure.toFixed(4)} bar</span></div>
                    <div>Flame Speed: <span className="font-mono text-yellow-400">{bstResult.flameSpeed.toFixed(3)} Mach</span></div>
                    <div>Impulse: <span className="font-mono text-yellow-400">{bstResult.positivePhaseImpulse.toFixed(3)} bar·ms</span></div>
                    <div>Duration: <span className="font-mono text-yellow-400">{bstResult.positivePhaseDuration.toFixed(2)} ms</span></div>
                  </>
                )}
                {activeMethod === 'tnt' && tntResult && (
                  <>
                    <div>TNT Equivalent: <span className="font-mono text-yellow-400">{tntResult.tntEquivalentMass.toFixed(2)} kg</span></div>
                    <div>Peak Overpressure: <span className="font-mono text-yellow-400">{tntResult.peakOverpressure.toFixed(4)} bar</span></div>
                    <div>Impulse: <span className="font-mono text-yellow-400">{tntResult.positivePhaseImpulse.toFixed(3)} bar·ms</span></div>
                    <div>Duration: <span className="font-mono text-yellow-400">{tntResult.positivePhaseDuration.toFixed(2)} ms</span></div>
                  </>
                )}
                {activeMethod === 'tno' && tnoResult && (
                  <>
                    <div>Source Strength: <span className="font-mono text-yellow-400">{tnoResult.sourceStrength}</span></div>
                    <div>Peak Overpressure: <span className="font-mono text-yellow-400">{tnoResult.peakOverpressure.toFixed(4)} bar</span></div>
                    <div>Impulse: <span className="font-mono text-yellow-400">{tnoResult.positivePhaseImpulse.toFixed(3)} bar·ms</span></div>
                    <div>Duration: <span className="font-mono text-yellow-400">{tnoResult.positivePhaseDuration.toFixed(2)} ms</span></div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;