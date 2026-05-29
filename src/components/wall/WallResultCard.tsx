import React from 'react';
import type { BlastWallOutput } from '../../types';

interface WallResultCardProps {
  result: BlastWallOutput;
}

export const WallResultCard: React.FC<WallResultCardProps> = ({ result }) => (
  <div className="bg-gray-800 rounded-lg p-4 space-y-3">
    <h3 className="text-lg font-semibold text-white">Wall Design Results</h3>
    <div className="grid grid-cols-2 gap-3">
      <ResultRow label="Required Thickness" value={`${result.requiredThickness.toFixed(1)} mm`} />
      <ResultRow label="Weight" value={`${result.weightPerUnitArea.toFixed(1)} kg/m²`} />
      <ResultRow label="Max Deflection" value={`${result.maxDeflection.toFixed(1)} mm`} />
      <ResultRow label="Ductility Ratio" value={result.ductilityRatio.toFixed(2)} />
      <ResultRow label="Support Reaction" value={`${result.supportReaction.toFixed(1)} kN/m`} />
      <ResultRow label="Support Moment" value={`${result.supportMoment.toFixed(1)} kN·m/m`} />
      <ResultRow label="Shear at Support" value={`${result.shearAtSupport.toFixed(1)} kN/m`} />
      <ResultRow label="Deflection Check" pass={result.passDeflection} />
      <ResultRow label="Ductility Check" pass={result.passDuctility} />
    </div>
    {result.materialRecommendation && (
      <div className="text-sm text-gray-400 italic border-t border-gray-700 pt-2">
        {result.materialRecommendation}
      </div>
    )}
  </div>
);

const ResultRow: React.FC<{ label: string; value?: string; pass?: boolean }> = ({ label, value, pass }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-400">{label}</span>
    {pass !== undefined ? (
      <span className={`text-sm font-medium ${pass ? 'text-green-400' : 'text-red-400'}`}>
        {pass ? '✓ PASS' : '✗ FAIL'}
      </span>
    ) : (
      <span className="text-sm font-mono text-yellow-400">{value}</span>
    )}
  </div>
);
