export interface AuthState {
    isAuthenticated: boolean;
    role?:string;
    id?:string;
  }
  
  export type AuthAction = { type: 'LOGIN'; role?: string; id?: string } | { type: 'LOGOUT' };
