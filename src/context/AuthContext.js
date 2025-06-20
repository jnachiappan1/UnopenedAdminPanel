// ** React Imports
import { createContext, useEffect, useState } from "react";

// ** Next Import
import { useNavigate, useSearchParams } from "react-router-dom";

// ** Axios
import axios from "axios";

// ** Config
import authConfig from "../configs/auth";
import FallbackSpinner from "src/@core/components/spinner";
import { ApiEndPoints } from "src/network/endpoints";

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState(
    defaultProvider.isInitialized
  );

  // ** Hooks
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initAuth = async () => {
      setIsInitialized(true);
      const storedToken = window.localStorage.getItem(
        authConfig.storageTokenKeyName
      );
      if (storedToken) {
        setLoading(true);
        await axios
          .get(ApiEndPoints.AUTH.me, {
            headers: {
              Authorization: `Bearer ${storedToken}`, // storedToken
            },
          })
          .then(async (response) => {
            setLoading(false);
            setUser({ ...response.data.user });
          })
          .catch(() => {
            localStorage.removeItem(authConfig.storageUserDataKeyName);
            localStorage.removeItem(authConfig.storageTokenKeyName);
            setUser(null);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogin = ({ token, user }) => {
    window.localStorage.setItem(authConfig.storageTokenKeyName, token);
    setUser(user);
    const redirectUrl = searchParams.get("redirect");
    navigate(redirectUrl || "/");
    console.log("user", user);
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem(authConfig.storageUserDataKeyName);
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    navigate("/login");
  };

  const handleRegister = () => {};

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return (
    <AuthContext.Provider value={values}>
      {loading ? <FallbackSpinner /> : children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
