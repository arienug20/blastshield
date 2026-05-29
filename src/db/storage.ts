import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'blastshield-projects';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  vceState: unknown;
  wallDesignState: unknown;
}

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveProjectToDB(project: ProjectData): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, project);
}

export async function loadProjectFromDB(id: string): Promise<ProjectData | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function deleteProjectFromDB(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function listProjectsFromDB(): Promise<ProjectData[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}
