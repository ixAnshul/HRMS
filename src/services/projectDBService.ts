/* eslint-disable @typescript-eslint/no-explicit-any */
import Projects from "../types/project"

const DB_NAME = 'ProjectDetails';
const STORE_NAME = 'projects';

export const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as any).result;
      db.createObjectStore(STORE_NAME, { keyPath: 'name' });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addProject = async (project: Projects) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.add(project);
  return new Promise<number>((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllProjects = async (): Promise<Projects[]> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.getAll();
  return new Promise<Projects[]>((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

export const getProjectById = async (projectId: string): Promise<Projects | undefined> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.get(projectId);

  return new Promise<Projects | undefined>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      const result = event.target.result;
      resolve(result);
    };

    request.onerror = () => reject(request.error);
  });
};

export const updateProjectById = async (projectId: string, updatedData: Projects): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.get(projectId);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      const existingData = event.target.result;

      if (existingData) {
        // Merge the existing data with the updated data
        const newData = { ...existingData, ...updatedData };

        const putRequest = store.put(newData, projectId);

        putRequest.onsuccess = () => {
          console.log(`project with ID ${projectId} updated successfully!`);
          resolve();
        };

        putRequest.onerror = () => reject(putRequest.error);
      } else {
        console.error(`project with ID ${projectId} not found.`);
        reject(`project with ID ${projectId} not found.`);
      }
    };

    request.onerror = () => reject(request.error);
  });
};

export const removeProjectById = async (projectId: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.delete(projectId);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
};