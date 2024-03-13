import { combineReducers, Reducer } from 'redux';
import authReducer from './authReducer';
import { AuthState, AuthAction } from '../Actions/authTypes';
 
const rootReducer: Reducer<{ auth: AuthState }, AuthAction> = combineReducers({
  auth: authReducer,
  // Add other reducers here if needed
});
 
export default rootReducer;