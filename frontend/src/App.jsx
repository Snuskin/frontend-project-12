import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { NotFound } from "./Components/ErrorPage";
import MainPage from "./Components/MainPage";
import { Login } from "./Components/LoginPage";
import { Signup } from "./Components/SignupPage";
import AuthContext from "./contexts/index";
import axios from "axios";
import routes from "./routes.js";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Provider, ErrorBoundary } from "@rollbar/react";
import {
  Provider as StoreProvider,
  useDispatch,
} from "react-redux";
import store from "./slices/index.js";
import { useAuth } from "./hooks/index";
import { setInitialChannels } from "./slices/channelsSlice";

const rollbarConfig = {
  accessToken: process.env.ACCESSTOKEN,
  environment: "testenv",
};

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem("userId");
    setLoggedIn(false);
  };

  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

const MainRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  const fetchContent = async () => {
    try {
      const { data } = await axios.get(routes.usersPath(), {
        headers: auth.getAuthHeader(),
      });
      if (data) {
        console.log(data);
        return data;
      }
    } catch (e) {
      if (e.isAxiosError && e.response.status === 401) {
        return null;
      }
    }
  };
  useEffect(() => {
    const loggedInUser = localStorage.getItem("userId");
    if (loggedInUser) {
      fetchContent().then((data) => {
        dispatch(setInitialChannels(data));
      });
    }
  }, []);
  const loggedInUser = localStorage.getItem("userId");
  return loggedInUser ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => {
  return (
    <Provider config={rollbarConfig}>
      <StoreProvider store={store}>
        <ErrorBoundary>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="*" element={<NotFound />} />
                <Route
                  path="/"
                  element={
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
        </ErrorBoundary>
      </StoreProvider>
    </Provider>
  );
};

export default App;
