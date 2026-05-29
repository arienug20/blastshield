import React from 'react';
import { Link } from 'react-router-dom';
import { useVCEStore } from '../store';

export const DashboardPage: React.FC = () => {
  const { bstResult, tntResult, tnoResult } = useVCEStore();
  const hasResults = !!(bstResult || tntResult || tnoResult);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">BlastShield Dashboard</h1>
        <p className="text-gray-400 mt-1">VCE Blast Analysis & Blast Wall Design Suite</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/vce"
          className="block bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-6 transition-colors hover:border-blue-500"
        >
          <div className="text-2xl mb-2">💥</div>
          <h2 className="text-lg font-semibold text-white">VCE Calculator</h2>
          <p className="text-sm text-gray-400 mt-1">BST, TNT Equivalent, TNO Multi-Energy</p>
        </Link>
        <Link
          to="/wall"
          className="block bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-6 transition-colors hover:border-blue-500"
        >
          <div className="text-2xl mb-2">🧱</div>
          <h2 className="text-lg font-semibold text-white">Blast Wall Designer</h2>
          <p className="text-sm text-gray-400 mt-1">Steel & RC wall sizing, connection design</p>
        </Link>
        <Link
          to="/damage"
          className="block bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-6 transition-colors hover:border-blue-500"
        >
          <div className="text-2xl mb-2">📏</div>
          <h2 className="text-lg font-semibold text-white">Damage Zones</h2>
          <p className="text-sm text-gray-400 mt-1">Safe distances & damage thresholds</p>
        </Link>
      </div>

      {/* Recent Results Summary */}
      {hasResults && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Analysis Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bstResult && (
              <div className="border border-gray-700 rounded p-3">
                <div className="text-sm text-gray-400">BST Peak Overpressure</div>
                <div className="text-lg font-mono text-yellow-400">{bstResult.peakOverpressure.toFixed(4)} bar</div>
              </div>
            )}
            {tntResult && (
              <div className="border border-gray-700 rounded p-3">
                <div className="text-sm text-gray-400">TNT Peak Overpressure</div>
                <div className="text-lg font-mono text-yellow-400">{tntResult.peakOverpressure.toFixed(4)} bar</div>
              </div>
            )}
            {tnoResult && (
              <div className="border border-gray-700 rounded p-3">
                <div className="text-sm text-gray-400">TNO Peak Overpressure</div>
                <div className="text-lg font-mono text-yellow-400">{tnoResult.peakOverpressure.toFixed(4)} bar</div>
              </div>
            )}
          </div>
        </div>
      )}

      {!hasResults && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-gray-500 text-lg">No analysis results yet.</div>
          <div className="text-gray-600 text-sm mt-2">Start with the VCE Calculator to run your first analysis.</div>
          <Link to="/vce" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium">
            Get Started →
          </Link>
        </div>
      )}
    </div>
  );
};
