/* eslint-disable @typescript-eslint/no-explicit-any */
import Notifications from "../types/notification"

const DB_NAME = 'NotificationDetails';
const STORE_NAME = 'notifications';

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

export const addNotification = async (notification: Notifications) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.add(notification);
  return new Promise<number>((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllNotifications = async (): Promise<Notifications[]> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.getAll();
  return new Promise<Notifications[]>((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
};

export const getNotificationById = async (notificationId: string): Promise<Notifications | undefined> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.get(notificationId);

  return new Promise<Notifications | undefined>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      const result = event.target.result;
      resolve(result);
    };

    request.onerror = () => reject(request.error);
  });
};

export const updateNotificationById = async (notificationId: string, updatedData: Notifications): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.get(notificationId);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      const existingData = event.target.result;

      if (existingData) {
        // Merge the existing data with the updated data
        const newData = { ...existingData, ...updatedData };

        const putRequest = store.put(newData, notificationId);

        putRequest.onsuccess = () => {
          console.log(`notification with ID ${notificationId} updated successfully!`);
          resolve();
        };

        putRequest.onerror = () => reject(putRequest.error);
      } else {
        console.error(`notification with ID ${notificationId} not found.`);
        reject(`notification with ID ${notificationId} not found.`);
      }
    };

    request.onerror = () => reject(request.error);
  });
};

export const removeNotificationById = async (notificationId: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.delete(notificationId);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
};