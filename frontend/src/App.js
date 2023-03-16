import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { NotFound } from './Components/Pages.jsx';
import MainPage from './Components/MainPage.jsx';
import {Login} from './Components/LoginPage.js';
import AuthContext from './contexts/index.jsx';
import React, { useState } from 'react';
import useAuth from './hooks/index.jsx';
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

const MainRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation()
  console.log({from: location })
  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{from: location }} />
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
