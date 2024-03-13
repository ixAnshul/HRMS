// /services/indexedDBService.ts

import { Employee } from "../types";

const DB_NAME = 'employeeDetails';
const STORE_NAME = 'employees';

export const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as any).result;
      db.createObjectStore(STORE_NAME, { keyPath: 'email' });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addEmployee = async (employee: any) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.add(employee);
  return new Promise<number>((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllEmployees = async () => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.getAll();
  return new Promise<Employee[]>((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

export const getEmployeeByKey = async (key: string) => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
  
    const request = store.get(key);
  
    return new Promise<Employee | undefined>((resolve, reject) => {
      request.onsuccess = (event: any) => {
        const result = event.target.result;
        resolve(result);
      };
  
      request.onerror = () => reject(request.error);
    });
  };

  export const updateEmployeeByKey = async (key: string, updatedData: any) => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(key);

    return new Promise<void>((resolve, reject) => {
        request.onsuccess = (event: any) => {
            const existingData = event.target.result;

            if (existingData) {
                // Merge the existing data with the updated data
                const newData = { ...existingData, ...updatedData };

                const putRequest = store.put(newData); // Remove the key parameter

                putRequest.onsuccess = () => {
                    console.log(`Employee with key ${key} updated successfully!`);
                    resolve();
                };

                putRequest.onerror = () => reject(putRequest.error);
            } else {
                console.error(`Employee with key ${key} not found.`);
                reject(`Employee with key ${key} not found.`);
            }
        };

        request.onerror = () => reject(request.error);
    });
};
  
  export const removeEmployeeByKey = async (key: string): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
  
    const request = store.delete(key);
  
    return new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {
        resolve();
      };
  
      request.onerror = () => reject(request.error);
    });
  };
  