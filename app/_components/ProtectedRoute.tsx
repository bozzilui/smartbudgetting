// app/_components/ProtectedRoute.tsx
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  if (loading || !user) return null;
  return children;
}
