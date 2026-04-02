import { clearUserData, getUserData, saveUserData } from "@/utils/storage";
import axios from "axios";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotifications";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  user: { _id: string; name: string; email: string } | null;
  authToken: string | null;
  Signup: (fullName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const tokenRegistered = React.useRef(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

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
      const data = await getUserData();

      if (data._id && data.name && data.email && data.token) {
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
        });

        setAuthToken(data.token);
        setIsAuthenticated(true);
      }
    })();
  }, []);

  /*
 LOGIN
 */
  const login = async (email: string, password: string) => {
    try {
      console.log("LOGIN START");

      const res = await axios.post(
        "https://myntraclone-7ekz.onrender.com/user/login",
        { email, password },
        { timeout: 60000 }
      );

      console.log("LOGIN RESPONSE:", res.data);

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

      registerForPushNotificationsAsync()
        .then(async (expoPushToken) => {
          if (!expoPushToken) return;

          await axios.post(
            "https://myntraclone-7ekz.onrender.com/notifications/register-device",
            {
              token: expoPushToken,
              deviceType: "android",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Device registered ✅");
        })
        .catch((err) => console.log("Push setup error:", err));

    } catch (error: any) {
      console.log(
        "LOGIN ERROR 👉",
        error?.response?.data || error.message
      );

      throw error;
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