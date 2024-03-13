// /reducers/employeeReducer.ts


import { ADD_EMPLOYEE, FETCH_EMPLOYEES, UPDATE_EMPLOYEE } from '../../Actions/actionTypes';
import { Employee } from '../../types';
interface Action {
  type: string;
  payload?: Employee | Employee[];
}

const initialState: Employee[] = [];

const employeeReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case ADD_EMPLOYEE:
      return [...state, action.payload as Employee];
    case FETCH_EMPLOYEES:
      return action.payload as Employee[];
    case UPDATE_EMPLOYEE:
      // Assuming payload includes updated employee and its id
      const { id, ...updatedEmployee } = action.payload as Employee;
      return state.map(employee => (employee.id === id ? updatedEmployee : employee));
    default:
      return state;
  }
};

export default employeeReducer;