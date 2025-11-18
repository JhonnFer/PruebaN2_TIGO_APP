// app/_layout.tsx
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../src/presentation/hooks/useAuth";

export default function RootLayout() {
  const { usuario, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const enAuth = segments[0] === "auth";

    if (!usuario && !enAuth) {
      setTimeout(() => router.replace("/auth/login"), 0);
    } else if (usuario && enAuth) {
      setTimeout(() => router.replace("/(tabs)"), 0);
    }
  }, [usuario, loading, segments]);

  // Slot raíz: renderiza la ruta correspondiente
  return <Slot />;
}
