import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {store,  persistor}  from './redux/store';
import { BrowserRouter as Router, NavLink } from 'react-router-dom'; // Make sure to alias BrowserRouter as Router
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <App />
      </PersistGate>
    </Provider>
  </Router>,
);

