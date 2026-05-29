import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  saveProjectToDB,
  loadProjectFromDB,
  deleteProjectFromDB,
  listProjectsFromDB,
  type ProjectData,
} from '../db/storage';

interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  currentProjectId: string | null;
  currentProjectName: string;
  currentProjectDescription: string;
  projects: ProjectSummary[];
  isDirty: boolean;
  isLoading: boolean;

  newProject: (name?: string, description?: string) => Promise<string>;
  openProject: (id: string) => Promise<void>;
  saveProject: () => Promise<void>;
  saveAsProject: (name: string, description?: string) => Promise<string>;
  deleteProject: (id: string) => Promise<void>;
  exportProject: () => Promise<void>;
  importProject: (file: File) => Promise<void>;
  loadProjectList: () => Promise<void>;
  markDirty: () => void;
  setCurrentProject: (id: string | null) => void;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  currentProjectId: null,
  currentProjectName: 'Untitled',
  currentProjectDescription: '',
  projects: [],
  isDirty: false,
  isLoading: false,

  newProject: async (name?: string, description?: string) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const projectName = name ?? 'Untitled Project';

    set({
      currentProjectId: id,
      currentProjectName: projectName,
      currentProjectDescription: description ?? '',
      isDirty: false,
    });

    // Save empty project to DB
    const { useVCEStore } = await import('./vceSlice');
    const { useWallDesignStore } = await import('./wallDesignSlice');
    const vceState = useVCEStore.getState();
    const wallState = useWallDesignStore.getState();

    const project: ProjectData = {
      id,
      name: projectName,
      description: description ?? '',
      createdAt: now,
      updatedAt: now,
      vceState: {
        fuelId: vceState.fuelId,
        flammableMass: vceState.flammableMass,
        ambientPressure: vceState.ambientPressure,
        ambientTemperature: vceState.ambientTemperature,
        confinement: vceState.confinement,
        congestion: vceState.congestion,
        standoffDistance: vceState.standoffDistance,
        tntEfficiency: vceState.tntEfficiency,
        tnoSourceStrength: vceState.tnoSourceStrength,
        cloudVolume: vceState.cloudVolume,
        activeMethod: vceState.activeMethod,
      },
      wallDesignState: {
        wallType: wallState.wallType,
        wallHeight: wallState.wallHeight,
        wallWidth: wallState.wallWidth,
        boundaryCondition: wallState.boundaryCondition,
        peakOverpressure: wallState.peakOverpressure,
        positivePhaseImpulse: wallState.positivePhaseImpulse,
        steelGrade: wallState.steelGrade,
        concreteGrade: wallState.concreteGrade,
        rebarGrade: wallState.rebarGrade,
        deflectionLimitRatio: wallState.deflectionLimitRatio,
        ductilityLimit: wallState.ductilityLimit,
      },
    };

    await saveProjectToDB(project);
    await get().loadProjectList();
    return id;
  },

  openProject: async (id: string) => {
    set({ isLoading: true });
    try {
      const data = await loadProjectFromDB(id);
      if (!data) throw new Error('Project not found');

      const { useVCEStore } = await import('./vceSlice');
      const { useWallDesignStore } = await import('./wallDesignSlice');

      if (data.vceState) {
        const vce = data.vceState as Record<string, unknown>;
        useVCEStore.setState({
          fuelId: (vce.fuelId as string) ?? 'methane',
          flammableMass: (vce.flammableMass as number) ?? 1000,
          ambientPressure: (vce.ambientPressure as number) ?? 1.013,
          ambientTemperature: (vce.ambientTemperature as number) ?? 293,
          confinement: (vce.confinement as string) ?? '2D',
          congestion: (vce.congestion as string) ?? 'medium',
          standoffDistance: (vce.standoffDistance as number) ?? 50,
          tntEfficiency: (vce.tntEfficiency as number) ?? 0.10,
          tnoSourceStrength: (vce.tnoSourceStrength as number) ?? 5,
          cloudVolume: (vce.cloudVolume as number) ?? 1000,
          activeMethod: (vce.activeMethod as string) ?? 'bst',
          bstResult: null,
          tntResult: null,
          tnoResult: null,
        });
      }

      if (data.wallDesignState) {
        const wall = data.wallDesignState as Record<string, unknown>;
        useWallDesignStore.setState({
          wallType: (wall.wallType as string) ?? 'steel_plate',
          wallHeight: (wall.wallHeight as number) ?? 3.0,
          wallWidth: (wall.wallWidth as number) ?? 4.0,
          boundaryCondition: (wall.boundaryCondition as string) ?? 'fixed_fixed',
          peakOverpressure: (wall.peakOverpressure as number) ?? 0.5,
          positivePhaseImpulse: (wall.positivePhaseImpulse as number) ?? 5.0,
          steelGrade: (wall.steelGrade as string) ?? 'A36',
          concreteGrade: (wall.concreteGrade as string) ?? 'C30_37',
          rebarGrade: (wall.rebarGrade as string) ?? 'Grade420',
          deflectionLimitRatio: (wall.deflectionLimitRatio as number) ?? 60,
          ductilityLimit: (wall.ductilityLimit as number) ?? 3.0,
          wallResult: null,
          connectionResult: null,
        });
      }

      set({
        currentProjectId: id,
        currentProjectName: data.name,
        currentProjectDescription: data.description,
        isDirty: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  saveProject: async () => {
    const { currentProjectId, currentProjectName, currentProjectDescription } = get();
    if (!currentProjectId) return;

    const { useVCEStore } = await import('./vceSlice');
    const { useWallDesignStore } = await import('./wallDesignSlice');
    const vceState = useVCEStore.getState();
    const wallState = useWallDesignStore.getState();

    const existing = await loadProjectFromDB(currentProjectId);
    const now = new Date().toISOString();

    const project: ProjectData = {
      id: currentProjectId,
      name: currentProjectName,
      description: currentProjectDescription,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      vceState: {
        fuelId: vceState.fuelId,
        flammableMass: vceState.flammableMass,
        ambientPressure: vceState.ambientPressure,
        ambientTemperature: vceState.ambientTemperature,
        confinement: vceState.confinement,
        congestion: vceState.congestion,
        standoffDistance: vceState.standoffDistance,
        tntEfficiency: vceState.tntEfficiency,
        tnoSourceStrength: vceState.tnoSourceStrength,
        cloudVolume: vceState.cloudVolume,
        activeMethod: vceState.activeMethod,
      },
      wallDesignState: {
        wallType: wallState.wallType,
        wallHeight: wallState.wallHeight,
        wallWidth: wallState.wallWidth,
        boundaryCondition: wallState.boundaryCondition,
        peakOverpressure: wallState.peakOverpressure,
        positivePhaseImpulse: wallState.positivePhaseImpulse,
        steelGrade: wallState.steelGrade,
        concreteGrade: wallState.concreteGrade,
        rebarGrade: wallState.rebarGrade,
        deflectionLimitRatio: wallState.deflectionLimitRatio,
        ductilityLimit: wallState.ductilityLimit,
      },
    };

    await saveProjectToDB(project);
    set({ isDirty: false });
    await get().loadProjectList();
  },

  saveAsProject: async (name, description) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    set({
      currentProjectId: id,
      currentProjectName: name,
      currentProjectDescription: description ?? '',
      isDirty: false,
    });

    // Reuse save logic with new ID
    await get().saveProject();
    return id;
  },

  deleteProject: async (id) => {
    await deleteProjectFromDB(id);
    const { currentProjectId } = get();
    if (currentProjectId === id) {
      set({ currentProjectId: null, currentProjectName: 'Untitled', currentProjectDescription: '', isDirty: false });
    }
    await get().loadProjectList();
  },

  exportProject: async () => {
    const { useVCEStore } = await import('./vceSlice');
    const { useWallDesignStore } = await import('./wallDesignSlice');
    const state = get();
    const vceState = useVCEStore.getState();
    const wallState = useWallDesignStore.getState();

    const data = {
      id: state.currentProjectId,
      name: state.currentProjectName,
      description: state.currentProjectDescription,
      exportedAt: new Date().toISOString(),
      vce: vceState,
      wallDesign: wallState,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.currentProjectName.replace(/[^a-zA-Z0-9]/g, '_')}.blastshield.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importProject: async (file) => {
    const text = await file.text();
    const data = JSON.parse(text);
    const id = uuidv4();
    const now = new Date().toISOString();

    const { useVCEStore } = await import('./vceSlice');
    const { useWallDesignStore } = await import('./wallDesignSlice');

    if (data.vce) {
      const vce = data.vce;
      useVCEStore.setState({
        fuelId: vce.fuelId ?? 'methane',
        flammableMass: vce.flammableMass ?? 1000,
        ambientPressure: vce.ambientPressure ?? 1.013,
        ambientTemperature: vce.ambientTemperature ?? 293,
        confinement: vce.confinement ?? '2D',
        congestion: vce.congestion ?? 'medium',
        standoffDistance: vce.standoffDistance ?? 50,
        tntEfficiency: vce.tntEfficiency ?? 0.10,
        tnoSourceStrength: vce.tnoSourceStrength ?? 5,
        cloudVolume: vce.cloudVolume ?? 1000,
        activeMethod: vce.activeMethod ?? 'bst',
      });
    }

    if (data.wallDesign) {
      const wall = data.wallDesign;
      useWallDesignStore.setState({
        wallType: wall.wallType ?? 'steel_plate',
        wallHeight: wall.wallHeight ?? 3.0,
        wallWidth: wall.wallWidth ?? 4.0,
        boundaryCondition: wall.boundaryCondition ?? 'fixed_fixed',
        peakOverpressure: wall.peakOverpressure ?? 0.5,
        positivePhaseImpulse: wall.positivePhaseImpulse ?? 5.0,
        steelGrade: wall.steelGrade ?? 'A36',
        concreteGrade: wall.concreteGrade ?? 'C30_37',
        rebarGrade: wall.rebarGrade ?? 'Grade420',
        deflectionLimitRatio: wall.deflectionLimitRatio ?? 60,
        ductilityLimit: wall.ductilityLimit ?? 3.0,
      });
    }

    const name = data.name ?? file.name.replace('.json', '');
    const description = data.description ?? '';

    set({
      currentProjectId: id,
      currentProjectName: name,
      currentProjectDescription: description,
      isDirty: false,
    });

    await get().saveProject();
  },

  loadProjectList: async () => {
    const projects = await listProjectsFromDB();
    set({
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    });
  },

  markDirty: () => {
    set({ isDirty: true });
  },

  setCurrentProject: (id) => {
    set({ currentProjectId: id });
  },
}));
