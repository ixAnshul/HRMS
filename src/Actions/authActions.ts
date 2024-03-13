import { AuthAction } from './authTypes';

export const login = (role:string, id:string): AuthAction => ({
  type: 'LOGIN',
  role,
  id
});

export const logout = (): AuthAction => ({
  type: 'LOGOUT',
});