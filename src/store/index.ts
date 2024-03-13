// /store/index.ts

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../store/rootReducer';

const store = createStore(rootReducer, applyMiddleware(thunk as any));

export default store;
