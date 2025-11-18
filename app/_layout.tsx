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

    const inAuthSegment = segments[0] === "auth";
    const inRootScreen = segments.length === 0; // Estamos en "/" (pantalla de bienvenida)

    if (!usuario && !inAuthSegment && !inRootScreen) {
      setTimeout(() => router.replace("/"), 0); // Redirige a pantalla de bienvenida
    } else if (usuario && inAuthSegment) {
      setTimeout(() => router.replace("/(tabs)"), 0); // Si logueado, va a las tabs
    }
  }, [usuario, loading, segments]);

  return <Slot />;
}
