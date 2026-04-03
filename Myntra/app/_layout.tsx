import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";
import axios from "axios";
import React from "react";

import { AuthProvider, useAuth } from "@/constants/context/AuthContext";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotifications";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent splash screen auto hide
SplashScreen.preventAutoHideAsync();

/*
Notification handler
Ensures notifications appear even when app is open
*/
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationData = {
  screen?: string;
  productId?: string;
};
export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Hide splash screen
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
}

/*
Main Navigation Layout
AuthProvider is now mounted so useAuth() works correctly
*/
function RootLayoutNav() {
  const router = useRouter();
  const { isAuthenticated, authLoading, authToken } = useAuth();

  /*
  Register push notifications after login
  */
  useEffect(() => {
    if (!authToken) return;

    async function setupNotifications() {
      const expoToken = await registerForPushNotificationsAsync();

      if (!expoToken) return;

      await axios.post(
        "https://myntraclone-7ekz.onrender.com/notifications/register-device",
        {
          token: expoToken,
          deviceType: "android",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Device token saved ✅");
    }

    setupNotifications();
  }, [authToken]);

  const handleNavigation = (data: NotificationData) => {
    if (!data) return;

    if (data.screen === "orders") router.push("/orders");
    if (data.screen === "home") router.push("/");
    if (data.screen === "product" && data.productId)
      router.push(`/product/${data.productId}`);
  };

  /*
  Notification Listeners
  */
  useEffect(() => {
    let handled = false;

    const checkInitialNotification = async () => {
      const response =
        await Notifications.getLastNotificationResponseAsync();

      if (response && !handled) {
        handled = true;

        const data =
          response.notification.request.content.data as NotificationData;

        setTimeout(() => handleNavigation(data), 500);
      }
    };

    checkInitialNotification();

    const notificationListener =
      Notifications.addNotificationReceivedListener(() => { });

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data =
          response.notification.request.content.data as NotificationData;

        handleNavigation(data);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  if (authLoading) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}
/*
Expo Router Setting
*/
export const unstable_settings = {
  staticRendering: false,
};