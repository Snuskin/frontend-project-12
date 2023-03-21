import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { NotFound } from './Components/Pages.jsx';
import MainPage from './Components/MainPage.jsx';
import {Login} from './Components/LoginPage.js';
import AuthContext from './contexts/index.jsx';
import axios from 'axios';
import routes from './routes.js';
import React, { useState } from 'react';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};
const fetchContent = async () => {
  const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
  return data
};
const MainRoute = ({ children }) => {

  const location = useLocation()
  const data = fetchContent()
  return (
    data ? children : <Navigate to="/login" state={{from: location }} />
  );
};
const App = () => {
  return (
<AuthProvider>
  <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path="/" element={
          <MainRoute>
            <MainPage />
          </MainRoute>
        } 
        />
        <Route path="/login" element={<Login />} />
      </Routes>
  </BrowserRouter>
</AuthProvider>
  );
}

export default App;
