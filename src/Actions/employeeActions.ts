// employeeActions.ts

import { Dispatch } from 'redux';
import { addEmployee as addEmployeeToDB, getAllEmployees as getAllEmployeesFromDB } from '../services/indexedDBService';
import { updateEmployeeByKey } from '../services/indexedDBService';
// Import the Employee type
import { Employee } from '../types';
import { ADD_EMPLOYEE, FETCH_EMPLOYEES, UPDATE_EMPLOYEE } from './actionTypes';

export const addEmployee = (employee: Employee) => async (dispatch: Dispatch) => {
  const id = await addEmployeeToDB(employee);
  dispatch({ type: ADD_EMPLOYEE, payload: { ...employee, id } });
};

export const fetchEmployees = () => async (dispatch: Dispatch) => {
  const employees = await getAllEmployeesFromDB();
  dispatch({ type: FETCH_EMPLOYEES, payload: employees });
};

export const updateEmployee = (employee: Employee) => async (dispatch: Dispatch) => {
  const updatedEmployee = await updateEmployeeByKey(employee.id, employee);
  dispatch({ type: UPDATE_EMPLOYEE, payload: updatedEmployee });
};
