import React from "react";
import { Stack } from "expo-router";

import { AuthProvider } from "@/constants/context/AuthContext";
import { ThemeProvider } from "@/theme/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}