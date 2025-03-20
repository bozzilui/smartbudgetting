// app/settings.tsx - Settings screen
import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { auth } from "../_auth/firebase";
import { router } from "expo-router";

export default function Settings() {
  const handleLogout = async () => {
    await auth.signOut();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleLogout} color="#ff4444" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
