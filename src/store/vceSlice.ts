import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  ConfinementLevel, 
  CongestionLevel,
  BSTOutput,
  TNTOutput,
  TNOOutput,
  CongestionAssessment
} from '../types';
import { runBSTAnalysis } from '../core/baker-strehlow';
import { runTNTAnalysis } from '../core/tnt-equivalent';
import { runTNOAnalysis } from '../core/tno-multi-energy';
import { fuelLibrary } from '../data/fuel-library';

interface VCEState {
  // Inputs
  fuelId: string;
  flammableMass: number;
  ambientPressure: number;
  ambientTemperature: number;
  confinement: ConfinementLevel;
  congestion: CongestionLevel;
  standoffDistance: number;
  tntEfficiency: number;
  tnoSourceStrength: number;
  cloudVolume: number;

  // Outputs
  bstResult: BSTOutput | null;
  tntResult: TNTOutput | null;
  tnoResult: TNOOutput | null;
  congestionAssessment: CongestionAssessment | null;

  // UI state
  activeMethod: 'bst' | 'tnt' | 'tno' | 'all';

  // Actions
  setFuelId: (id: string) => void;
  setFlammableMass: (mass: number) => void;
  setAmbientPressure: (pressure: number) => void;
  setAmbientTemperature: (temperature: number) => void;
  setConfinement: (level: ConfinementLevel) => void;
  setCongestion: (level: CongestionLevel) => void;
  setStandoffDistance: (distance: number) => void;
  setTntEfficiency: (efficiency: number) => void;
  setTnoSourceStrength: (strength: number) => void;
  setCloudVolume: (volume: number) => void;
  setActiveMethod: (method: 'bst' | 'tnt' | 'tno' | 'all') => void;
  setCongestionAssessment: (assessment: CongestionAssessment) => void;
  runBSTAnalysis: () => void;
  runTNTAnalysis: () => void;
  runTNOAnalysis: () => void;
  runAllAnalyses: () => void;
  reset: () => void;
}

const initialState = {
  fuelId: 'methane',
  flammableMass: 1000,
  ambientPressure: 1.013,
  ambientTemperature: 293,
  confinement: '2D' as ConfinementLevel,
  congestion: 'medium' as CongestionLevel,
  standoffDistance: 50,
  tntEfficiency: 0.10,
  tnoSourceStrength: 5,
  cloudVolume: 1000,
  bstResult: null,
  tntResult: null,
  tnoResult: null,
  congestionAssessment: null,
  activeMethod: 'bst' as const
};

export const useVCEStore = create<VCEState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setFuelId: (fuelId) => set({ fuelId }),
      
      setFlammableMass: (flammableMass) => set({ flammableMass }),
      
      setAmbientPressure: (ambientPressure) => set({ ambientPressure }),
      
      setAmbientTemperature: (ambientTemperature) => set({ ambientTemperature }),
      
      setConfinement: (confinement) => set({ confinement }),
      
      setCongestion: (congestion) => set({ congestion }),
      
      setStandoffDistance: (standoffDistance) => set({ standoffDistance }),
      
      setTntEfficiency: (tntEfficiency) => set({ tntEfficiency }),
      
      setTnoSourceStrength: (tnoSourceStrength) => set({ tnoSourceStrength }),
      
      setCloudVolume: (cloudVolume) => set({ cloudVolume }),
      
      setActiveMethod: (activeMethod) => set({ activeMethod }),
      
      setCongestionAssessment: (congestionAssessment) => set({ congestionAssessment }),

      runBSTAnalysis: () => {
        const state = get();
        const fuel = fuelLibrary.find(f => f.id === state.fuelId) || fuelLibrary[0];
        
        const result = runBSTAnalysis(
          state.fuelId,
          state.flammableMass,
          state.confinement,
          state.congestion,
          state.standoffDistance,
          state.ambientPressure,
          state.ambientTemperature
        );

        set({ bstResult: result });
      },

      runTNTAnalysis: () => {
        const state = get();
        const fuel = fuelLibrary.find(f => f.id === state.fuelId) || fuelLibrary[0];
        
        const result = runTNTAnalysis(
          state.flammableMass,
          fuel.heatOfCombustion,
          state.tntEfficiency,
          state.standoffDistance,
          state.ambientPressure
        );

        set({ tntResult: result });
      },

      runTNOAnalysis: () => {
        const state = get();
        
        const result = runTNOAnalysis(
          state.tnoSourceStrength,
          state.cloudVolume,
          state.standoffDistance,
          state.ambientPressure
        );

        set({ tnoResult: result });
      },

      runAllAnalyses: () => {
        const store = get();
        store.runBSTAnalysis();
        store.runTNTAnalysis();
        store.runTNOAnalysis();
      },

      reset: () => set(initialState)
    }),
    {
      name: 'blastshield-vce',
      storage: createJSONStorage(() => localStorage)
    }
  )
);