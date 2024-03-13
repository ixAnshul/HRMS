// /redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';

const persistConfig = {
  key: 'root',
  storage: storage, // Use local storage if available
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
});
const persistor = persistStore(store);

export { store, persistor };

// const store = configureStore({
//   reducer: rootReducer
// });

// export default store;
