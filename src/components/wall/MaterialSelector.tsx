import React from 'react';

interface MaterialSelectorProps {
  materialType: 'steel_plate' | 'reinforced_concrete';
  steelGrade: string;
  concreteGrade: string;
  onMaterialTypeChange: (type: 'steel_plate' | 'reinforced_concrete') => void;
  onSteelGradeChange: (grade: string) => void;
  onConcreteGradeChange: (grade: string) => void;
}

const steelOptions = ['A36', 'A572_Gr50', 'A516_Gr70', 'A992', 'A514', 'SS304', 'SS316'];
const concreteOptions = ['C25_30', 'C30_37', 'C40_50', 'C50_60', 'UHPC'];

export const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  materialType, steelGrade, concreteGrade,
  onMaterialTypeChange, onSteelGradeChange, onConcreteGradeChange,
}) => (
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-300">Wall Material</label>
      <div className="flex gap-2">
        {(['steel_plate', 'reinforced_concrete'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onMaterialTypeChange(t)}
            className={`flex-1 px-3 py-2 rounded text-sm border transition-colors ${
              materialType === t
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
            }`}
          >
            {t === 'steel_plate' ? 'Steel Plate' : 'Reinforced Concrete'}
          </button>
        ))}
      </div>
    </div>
    {materialType === 'steel_plate' ? (
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">Steel Grade</label>
        <select
          value={steelGrade}
          onChange={(e) => onSteelGradeChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
        >
          {steelOptions.map((g) => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
        </select>
      </div>
    ) : (
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">Concrete Grade</label>
        <select
          value={concreteGrade}
          onChange={(e) => onConcreteGradeChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
        >
          {concreteOptions.map((g) => <option key={g} value={g}>{g.replace('_', '/')}</option>)}
        </select>
      </div>
    )}
  </div>
);
