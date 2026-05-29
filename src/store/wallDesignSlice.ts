import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  WallType,
  BoundaryCondition,
  BlastWallOutput,
  ConnectionOutput
} from '../types';
import { designSteelPlateWall } from '../core/blast-wall-steel';
import { designConcreteWall } from '../core/blast-wall-concrete';
import { designAnchor } from '../core/connection-design';

interface WallDesignState {
  // Inputs
  wallType: WallType;
  wallHeight: number;
  wallWidth: number;
  boundaryCondition: BoundaryCondition;
  peakOverpressure: number;
  positivePhaseImpulse: number;
  steelGrade: string;
  concreteGrade: string;
  rebarGrade: string;
  deflectionLimitRatio: number;
  ductilityLimit: number;

  // Outputs
  wallResult: BlastWallOutput | null;
  connectionResult: ConnectionOutput | null;

  // Actions
  setWallType: (type: WallType) => void;
  setWallDimensions: (height: number, width: number) => void;
  setBoundaryCondition: (condition: BoundaryCondition) => void;
  setBlastLoad: (pressure: number, impulse: number) => void;
  setMaterial: (steelGrade?: string, concreteGrade?: string, rebarGrade?: string) => void;
  setDesignCriteria: (deflectionLimitRatio: number, ductilityLimit: number) => void;
  runWallDesign: () => void;
  runConnectionDesign: () => void;
  reset: () => void;
}

const initialState = {
  wallType: 'steel_plate' as WallType,
  wallHeight: 3.0,
  wallWidth: 4.0,
  boundaryCondition: 'fixed_fixed' as BoundaryCondition,
  peakOverpressure: 0.5,
  positivePhaseImpulse: 5.0,
  steelGrade: 'A36',
  concreteGrade: 'C30_37',
  rebarGrade: 'Grade420',
  deflectionLimitRatio: 60,
  ductilityLimit: 3.0,
  wallResult: null,
  connectionResult: null
};

export const useWallDesignStore = create<WallDesignState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setWallType: (wallType) => set({ wallType }),
      
      setWallDimensions: (wallHeight, wallWidth) => set({ wallHeight, wallWidth }),
      
      setBoundaryCondition: (boundaryCondition) => set({ boundaryCondition }),
      
      setBlastLoad: (peakOverpressure, positivePhaseImpulse) => 
        set({ peakOverpressure, positivePhaseImpulse }),
      
      setMaterial: (steelGrade, concreteGrade, rebarGrade) => 
        set((state) => ({
          steelGrade: steelGrade ?? state.steelGrade,
          concreteGrade: concreteGrade ?? state.concreteGrade,
          rebarGrade: rebarGrade ?? state.rebarGrade
        })),
      
      setDesignCriteria: (deflectionLimitRatio, ductilityLimit) =>
        set({ deflectionLimitRatio, ductilityLimit }),

      runWallDesign: () => {
        const state = get();
        let result: BlastWallOutput;

        if (state.wallType === 'steel_plate') {
          result = designSteelPlateWall(
            state.peakOverpressure,
            state.positivePhaseImpulse,
            state.wallHeight,
            state.wallWidth,
            state.boundaryCondition,
            state.steelGrade as any,
            state.deflectionLimitRatio,
            state.ductilityLimit
          );
        } else if (state.wallType === 'reinforced_concrete') {
          result = designConcreteWall(
            state.peakOverpressure,
            state.positivePhaseImpulse,
            state.wallHeight,
            state.wallWidth,
            state.boundaryCondition,
            state.concreteGrade as any,
            state.rebarGrade as any,
            state.deflectionLimitRatio,
            state.ductilityLimit
          );
        } else {
          // For precast and modular, use concrete as default
          result = designConcreteWall(
            state.peakOverpressure,
            state.positivePhaseImpulse,
            state.wallHeight,
            state.wallWidth,
            state.boundaryCondition,
            state.concreteGrade as any,
            state.rebarGrade as any,
            state.deflectionLimitRatio,
            state.ductilityLimit
          );
        }

        set({ wallResult: result });
      },

      runConnectionDesign: () => {
        const state = get();
        
        if (!state.wallResult) {
          return;
        }

        const result = designAnchor(
          state.wallResult.supportReaction / state.wallWidth, // kN/m to kN per connection
          state.wallResult.shearAtSupport / state.wallWidth,  // kN/m to kN per connection
          30, // Concrete strength (MPa)
          150, // Embedment depth (mm)
          100  // Edge distance (mm)
        );

        set({ connectionResult: result });
      },

      reset: () => set(initialState)
    }),
    {
      name: 'blastshield-wall-design',
      storage: createJSONStorage(() => localStorage)
    }
  )
);