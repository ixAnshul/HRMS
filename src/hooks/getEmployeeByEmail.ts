import { openDB } from "../services/indexedDBService";
import { Employee } from "../types";

export const getEmployeeByEmail = async (email: string) => {
    const db = await openDB();
    const transaction = db.transaction("employees", 'readonly');
    const store = transaction.objectStore("employees");
  
    const request = store.get(email);
  
    return new Promise<Employee | undefined>((resolve, reject) => {
      request.onsuccess = (event: any) => {
        const result = event.target.result;
        resolve(result);
      };
  
      request.onerror = () => reject(request.error);
    });
  };
  