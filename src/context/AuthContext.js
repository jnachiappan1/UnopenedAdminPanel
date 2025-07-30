// ** React Imports
import { createContext, useEffect, useState, useMemo } from "react";

// ** Next Import
import { useNavigate, useSearchParams } from "react-router-dom";

// ** Axios
import axios from "axios";

// ** Config
import authConfig from "../configs/auth";
import FallbackSpinner from "src/@core/components/spinner";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError } from "src/utils/utils";
import { getPermissionNames } from "src/utils/permissions";

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
  userType: null,
  setUserType: () => null,
  permissionsList: [],
  setPermissionsList: () => [],
  permissionsWithNames: [],
  permissionsLoading: false,
  setPermissionsLoading: () => Boolean,
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState(
    defaultProvider.isInitialized
  );
  const [userType, setUserType] = useState(defaultProvider.userType);
  const [permissionsList, setPermissionsList] = useState(
    defaultProvider.permissionsList
  );
  const [permissionsLoading, setPermissionsLoading] = useState(
    defaultProvider.permissionsLoading
  );

  // Calculate permissionsWithNames whenever user or permissionsList changes
  const permissionsWithNames = useMemo(() => {
    return getPermissionNames(user?.admin_role?.permission, permissionsList);
  }, [user?.admin_role?.permission, permissionsList]);

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
            setUser({ ...response?.data?.data?.user });
            setUserType(response.data.data.type);
            if (response.data.data.type === "sub_admin") {
              fetchPermissions();
            }
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

  const handleLogin = ({ token, user, type }) => {
    window.localStorage.setItem(authConfig.storageTokenKeyName, token);
    setUser(user);
    setUserType(type);
    const redirectUrl = searchParams.get("redirect");
    navigate(redirectUrl || "/");
    if (type === "sub_admin") {
      fetchPermissions();
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem(authConfig.storageUserDataKeyName);
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    navigate("/login");
  };
  
  const fetchPermissions = async () => {
    try {
      setPermissionsLoading(true);
      const response = await axios.get(ApiEndPoints.PERMISSION.list, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            authConfig.storageTokenKeyName
          )}`,
        },
      });
      setPermissionsList(response.data.data.permission);
    } catch (error) {
      toastError(error);
      setPermissionsList([]); // fallback
    } finally {
      setPermissionsLoading(false);
    }
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
    userType,
    setUserType,
    permissionsList,
    setPermissionsList,
    permissionsWithNames,
    permissionsLoading,
    setPermissionsLoading,
  };

  return (
    <AuthContext.Provider value={values}>
      {loading ? <FallbackSpinner /> : children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
