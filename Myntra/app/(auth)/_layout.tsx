import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '@/constants/context/AuthContext';

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </AuthProvider>
  );
}
