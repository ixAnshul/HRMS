import { useState } from 'react';
import Employee from '../types/Employee';
import { addEmployee } from '../services/indexedDBService';

const createEmployee = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const addEmployees = async (employeeData: any) => {
    try {
      setLoading(true);

      addEmployee(employeeData);

      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error adding employee to IndexedDB:', error);
      setLoading(false);
      setError('Error adding employee. Please try again.');
    }
  };

  return { addEmployees, loading, error };
};

export default createEmployee;
