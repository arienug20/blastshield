import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  currentProjectId: string | null;
  projects: ProjectSummary[];
  
  newProject: (name: string, description: string) => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      currentProjectId: null,
      projects: [],

      newProject: (name, description) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        
        const project: ProjectSummary = {
          id,
          name,
          description,
          createdAt: now,
          updatedAt: now
        };

        set((state) => ({
          projects: [...state.projects, project],
          currentProjectId: id
        }));
      },

      loadProject: (id) => {
        set({ currentProjectId: id });
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId
        }));
      },

      setCurrentProject: (id) => {
        set({ currentProjectId: id });
      }
    }),
    {
      name: 'blastshield-projects',
      storage: createJSONStorage(() => localStorage)
    }
  )
);