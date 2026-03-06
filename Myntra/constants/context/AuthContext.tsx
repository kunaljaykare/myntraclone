import { clearUserData, getUserData, saveUserData } from "@/utils/storage";
import axios from "axios";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotifications";
import React, { createContext, useContext, useEffect, useState } from "react";
type AuthContextType = {
  isAuthenticated: boolean;
  user: { _id: string; name: string; email: string } | null;
  Signup: (fullName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const tokenRegistered = React.useRef(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    _id: string;
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getUserData();
      if (data._id && data.name && data.email) {
        setUser({ _id: data._id, name: data.name, email: data.email });
        setIsAuthenticated(true);
      }
    })();
  }, []);
  useEffect(() => {
    if (!user || tokenRegistered.current) return;

    const setupNotifications = async () => {
      try {
        const expoPushToken = await registerForPushNotificationsAsync();

        if (!expoPushToken) return;

        await axios.post(
          "https://myntraclone-7ekz.onrender.com/api/notifications/register-device",
          {
            token: expoPushToken,
            deviceType: "android",
          },
          {
            headers: {
              Authorization: `Bearer ${user._id}`,
            },
          }
        );
        tokenRegistered.current = true;

        console.log("Push token registered successfully");
      } catch (error) {
        console.error("Notification setup failed:", error);
      }
    };

    setupNotifications();
  }, [user]);

  const login = async (email: string, password: string) => {
    const res = await axios.post(
      "https://myntraclone-7ekz.onrender.com/user/login",
      {
        email,
        password,
      });

    const data = res.data.user;
    if (data.fullName) {
      await saveUserData(data._id, data.fullName, data.email);
      setUser({ _id: data._id, name: data.fullName, email: data.email });
      setIsAuthenticated(true);
    } else {
      throw new Error("Login failed");
    }
  };
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
      });
    const data = res.data.user;
    if (data.fullName) {
      await saveUserData(data._id, data.fullName, data.email);
      setUser({
        _id: data._id,
        name: data.fullName,
        email: data.email
      });
      setIsAuthenticated(true);
    } else {
      throw new Error("Signup failed");
    }
  };
  const logout = async () => {
    await clearUserData();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, Signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
