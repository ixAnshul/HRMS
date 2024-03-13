// /redux/employee/employeeActions.ts

import * as types from './employeeTypes';

// Define action creators
export const setEmployeeProfilePhoto = (photoUrl: string) => ({
  type: types.SET_EMPLOYEE_PROFILE_PHOTO,
  payload: photoUrl,
});

export const setEmployeeName = (name: string) => ({
  type: types.SET_EMPLOYEE_NAME,
  payload: name,
});

export const setEmployeeOtherInfo = (otherInfo: string) => ({
  type: types.SET_EMPLOYEE_OTHER_INFO,
  payload: otherInfo,
});

// Additional action creators
export const setEmployeeUsername = (username: string) => ({
  type: types.SET_EMPLOYEE_USERNAME,
  payload: username,
});

export const setEmployeeEmail = (email: string) => ({
  type: types.SET_EMPLOYEE_EMAIL,
  payload: email,
});

export const setEmployeeFirstname = (firstname: string) => ({
  type: types.SET_EMPLOYEE_FIRSTNAME,
  payload: firstname,
});

export const setEmployeeLastname = (lastname: string) => ({
  type: types.SET_EMPLOYEE_LASTNAME,
  payload: lastname,
});

export const setEmployeeDOB = (dob: moment.Moment) => ({
  type: types.SET_EMPLOYEE_DOB,
  payload: dob,
});

export const setEmployeeMobile = (mobile: string) => ({
  type: types.SET_EMPLOYEE_MOBILE,
  payload: mobile,
});

export const setEmployeeGender = (gender: string) => ({
  type: types.SET_EMPLOYEE_GENDER,
  payload: gender,
});

export const setEmployeeJobDescription = (jobDescription: string) => ({
  type: types.SET_EMPLOYEE_JOB_DESCRIPTION,
  payload: jobDescription,
});

export const setEmployeeSkills = (skills: string[]) => ({
  type: types.SET_EMPLOYEE_SKILLS,
  payload: skills,
});

// Add more action creators as needed
