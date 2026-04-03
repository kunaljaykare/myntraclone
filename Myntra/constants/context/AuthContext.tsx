import { clearUserData, getUserData, saveUserData } from "@/utils/storage";
import axios from "axios";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotifications";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  authLoading: boolean;
  user: { _id: string; name: string; email: string } | null;
  authToken: string | null;
  Signup: (fullName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const tokenRegistered = React.useRef(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<{
    _id: string;
    name: string;
    email: string;
  } | null>(null);

  /*
  Load user from storage
  */
  useEffect(() => {
    (async () => {
      try {
        const data = await getUserData();

        if (data?.token && data._id && data.name && data.email) {
          setUser({
            _id: data._id,
            name: data.name,
            email: data.email,
          });

          setAuthToken(data.token);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.log("Storage load error", err);
      } finally {
        setAuthLoading(false); // ⭐ IMPORTANT
      }
    })();
  }, []);

  /*
 LOGIN
 */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("LOGIN START");

      const res = await axios.post(
        "https://myntraclone-7ekz.onrender.com/user/login",
        { email, password },
        { timeout: 60000 }
      );

      const { user, token } = res.data;

      await saveUserData(user._id, user.fullName, user.email, token);

      setUser({
        _id: user._id,
        name: user.fullName,
        email: user.email,
      });

      setAuthToken(token);
      setIsAuthenticated(true);

      console.log("AUTH SUCCESS ✅");

      return true; // ⭐ IMPORTANT
    } catch (error: any) {
      console.log(
        "LOGIN ERROR 👉",
        error?.response?.data || error.message
      );

      return false; // ⭐ IMPORTANT
    }
  };

  /*
  SIGNUP
  */
  const Signup = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    const res = await axios.post(
      "https://myntraclone-7ekz.onrender.com/user/signup",
      {
        fullName,
        email,
        password,
      }
    );

    const { user, token } = res.data;

    await saveUserData(user._id, user.fullName, user.email, token);

    setUser({
      _id: user._id,
      name: user.fullName,
      email: user.email,
    });

    setAuthToken(token);
    setIsAuthenticated(true);
  };

  /*
  LOGOUT
  */
  const logout = async () => {
    await clearUserData();

    setUser(null);
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authLoading,
        user,
        authToken,
        Signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;