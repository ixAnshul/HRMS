/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tasks } from "../types";

const DB_NAME = 'TaskDetails';
const STORE_NAME = 'tasks';

export const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as any).result;
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addTask = async (task: Tasks) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.add(task);
  return new Promise<number>((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllTasks = async (): Promise<Tasks[]> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.getAll();
  return new Promise<Tasks[]>((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

export const getTaskById = async (taskId: string): Promise<Tasks | undefined> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.get(taskId);

  return new Promise<Tasks | undefined>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      const result = event.target.result;
      resolve(result);
    };

    request.onerror = () => reject(request.error);
  });
};

export const updateTaskById = async (taskId: string, updatedData: Tasks): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.get(taskId);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      const existingData = event.target.result;

      if (existingData) {
        // Merge the existing data with the updated data
        const newData = { ...existingData, ...updatedData };

        const putRequest = store.put(newData, taskId);

        putRequest.onsuccess = () => {
          console.log(`Task with ID ${taskId} updated successfully!`);
          resolve();
        };

        putRequest.onerror = () => reject(putRequest.error);
      } else {
        console.error(`Task with ID ${taskId} not found.`);
        reject(`Task with ID ${taskId} not found.`);
      }
    };

    request.onerror = () => reject(request.error);
  });
};

export const removeTaskById = async (taskId: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.delete(taskId);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
};