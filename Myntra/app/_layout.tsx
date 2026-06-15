import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  ThemeProvider as NavigationThemeProvider,
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
import { ThemeProvider } from "@/theme/ThemeContext";
import { AuthProvider, useAuth } from "@/constants/context/AuthContext";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotifications";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform } from "react-native";
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
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  useEffect(() => {
    const receivedListener =
      Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log(
            "Notification received:",
            notification
          );
        }
      );

    return () => {
      receivedListener.remove();
    };
  }, []);

  const router = useRouter();

  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log(
            "Notification tapped:",
            response
          );

          const data =
            response.notification.request.content.data;

          if (data?.productId) {
            router.push(`/product/${data.productId}`);
          }
        }
      );

    return () => {
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider>
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
      try {
        await axios.post(
          "https://myntraclone-7ekz.onrender.com/notifications/register-device",
          {
            token: expoToken,
            deviceType: Platform.OS,
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        console.log("Device token saved ✅");
      } catch (error) {
        console.error("Error saving device token:", error);
      }
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

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data =
          response.notification.request.content.data as NotificationData;

        handleNavigation(data);
      });

    return () => {
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