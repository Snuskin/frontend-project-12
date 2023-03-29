import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { NotFound } from './Components/Pages.jsx';
import MainPage from './Components/MainPage.jsx';
import {Login} from './Components/LoginPage.js';
import {Signup} from './Components/SignupPage';
import AuthContext from './contexts/index.jsx';
import SocketContext from './contexts/socketContext';
import { initSockets } from './sockets/index.js';
import axios from 'axios';
import routes from './routes.js';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: '34f925f0123e48aa8e978d225853862e',
  environment: 'testenv',
};

const SocketProvider = ({children}) => {
  const [host, setHost] = useState("http://localhost:5001")
  useEffect(() => {
    initSockets();
  })
  return (
    <SocketContext.Provider value={host}>
      {children}
    </SocketContext.Provider>
  )
}
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
  try {
    const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
    return data
  } catch (e) {
    if (e.isAxiosError && e.response.status === 401) {
      return null;
    }
  } 
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
<Provider config={rollbarConfig}>
  <ErrorBoundary>
    <SocketProvider>
      <AuthProvider>
        <BrowserRouter>
            <Routes>
              <Route path='*' element={<NotFound />} />
              <Route path="/" element={
                <MainRoute>
                  <MainPage />
                  <ToastContainer />
                </MainRoute>
              } 
              />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SocketProvider>
  </ErrorBoundary>
</Provider>
  );
}

export default App;
