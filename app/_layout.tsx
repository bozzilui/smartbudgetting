// app/_layout.tsx (Root layout)
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TransactionProvider>
    </AuthProvider>
  );
}
