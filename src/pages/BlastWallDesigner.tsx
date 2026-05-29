import React from 'react';
import { useWallDesignStore } from '../store';
import { useVCEStore } from '../store';
import { NumberInput } from '../components/shared/NumberInput';
import { MaterialSelector } from '../components/wall/MaterialSelector';
import { WallResultCard } from '../components/wall/WallResultCard';

export const BlastWallDesigner: React.FC = () => {
  const wallStore = useWallDesignStore();
  const { bstResult } = useVCEStore();

  const importFromVCE = () => {
    if (bstResult) {
      wallStore.setBlastLoad(bstResult.peakOverpressure, bstResult.positivePhaseImpulse);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Blast Wall Designer</h1>

      {/* Input */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Design Parameters</h2>
          {bstResult && (
            <button
              onClick={importFromVCE}
              className="text-sm bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Import from VCE ({bstResult.peakOverpressure.toFixed(3)} bar)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput label="Peak Overpressure" unit="bar" value={wallStore.peakOverpressure}
            onChange={(v) => wallStore.setBlastLoad(v, wallStore.positivePhaseImpulse)} min={0} step={0.01} />
          <NumberInput label="Positive Phase Impulse" unit="bar·ms" value={wallStore.positivePhaseImpulse}
            onChange={(v) => wallStore.setBlastLoad(wallStore.peakOverpressure, v)} min={0} step={0.1} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput label="Wall Height" unit="m" value={wallStore.wallHeight}
            onChange={(v) => wallStore.setWallDimensions(v, wallStore.wallWidth)} min={0.1} step={0.1} />
          <NumberInput label="Wall Width" unit="m" value={wallStore.wallWidth}
            onChange={(v) => wallStore.setWallDimensions(wallStore.wallHeight, v)} min={0.1} step={0.1} />
        </div>

        <MaterialSelector
          materialType={wallStore.wallType as 'steel_plate' | 'reinforced_concrete'}
          steelGrade={wallStore.steelGrade}
          concreteGrade={wallStore.concreteGrade}
          onMaterialTypeChange={(t) => wallStore.setWallType(t)}
          onSteelGradeChange={(g) => wallStore.setMaterial(g, undefined, undefined)}
          onConcreteGradeChange={(g) => wallStore.setMaterial(undefined, g, undefined)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Boundary Condition</label>
            <select
              value={wallStore.boundaryCondition}
              onChange={(e) => wallStore.setBoundaryCondition(e.target.value as any)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="simply_supported">Simply Supported</option>
              <option value="fixed_fixed">Fixed-Fixed</option>
              <option value="cantilever">Cantilever</option>
              <option value="fixed_pinned">Fixed-Pinned</option>
            </select>
          </div>
          <NumberInput label="Deflection Limit (L/)" value={wallStore.deflectionLimitRatio}
            onChange={(v) => wallStore.setDesignCriteria(v, wallStore.ductilityLimit)} min={1} step={1} />
        </div>

        <button
          onClick={() => { wallStore.runWallDesign(); wallStore.runConnectionDesign(); }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg"
        >
          Design Wall
        </button>
      </div>

      {/* Results */}
      {wallStore.wallResult && <WallResultCard result={wallStore.wallResult} />}

      {/* Cross-section placeholder */}
      {wallStore.wallResult && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Cross Section</h2>
          <div className="border border-gray-600 border-dashed rounded-lg h-48 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📐</div>
              <div>Wall cross-section sketch</div>
              <div className="text-sm mt-1">
                Thickness: {wallStore.wallResult.requiredThickness.toFixed(0)} mm | Height: {wallStore.wallHeight} m
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
