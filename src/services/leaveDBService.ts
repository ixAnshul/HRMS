/* eslint-disable @typescript-eslint/no-explicit-any */
import leaves from "../types/leave"

const DB_NAME = 'LeaveDetails';
const STORE_NAME = 'Leaves';

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

export const addLeave = async (leave: leaves) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.add(leave);
  return new Promise<number>((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllLeaves = async (): Promise<leaves[]> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.getAll();
  return new Promise<leaves[]>((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

export const getLeaveById = async (leaveId: string): Promise<leaves | undefined> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.get(leaveId);

  return new Promise<leaves | undefined>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      const result = event.target.result;
      resolve(result);
    };

    request.onerror = () => reject(request.error);
  });
};

export const updateLeaveById = async (leaveId: string, updatedData: leaves): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.get(leaveId);
    console.log(request,"request")
  return new Promise<void>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      const existingData = event.target.result;

      if (existingData) {
        // Merge the existing data with the updated data
        const newData = { ...existingData, ...updatedData };
        console.log(newData,"data")
        const putRequest = store.put(newData, leaveId);

        putRequest.onsuccess = () => {
          console.log(`leave with ID ${leaveId} updated successfully!`);
          resolve();
        };

        putRequest.onerror = () => reject(putRequest.error);
      } else {
        console.error(`leave with ID ${leaveId} not found.`);
        reject(`leave with ID ${leaveId} not found.`);
      }
    };

    request.onerror = () => reject(request.error);
  });
};

export const removeLeaveById = async (leaveId: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.delete(leaveId);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
};