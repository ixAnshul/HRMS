import { AuthState, AuthAction } from '../Actions/authTypes';

const initialState: AuthState = {
  isAuthenticated: false,
  role: undefined,
  id: undefined,
};

const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        role: action.role,
        id: action.id
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        role: undefined,
        id: undefined,
      };
    default:
      return state;
  }
};

export default authReducer;