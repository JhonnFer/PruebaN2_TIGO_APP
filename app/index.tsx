// app/index.tsx
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { ActivityIndicator, View, Text } from "react-native";

export default function Index() {
  const { usuario, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!usuario) {
        // Si no hay usuario logueado, vamos a login
        router.replace("/auth/login");
      } else {
        // Redirigir según rol
        if (usuario.role === "Registrado") {
          router.replace("/(tabs)/Registrado/index"); // <--- apunta al index.tsx
        } else if (usuario.role === "Asesor") {
          router.replace("/(tabs)/Asesor/index"); // <--- apunta al index.tsx
        } else {
          // Por si hay otro rol
          console.warn("Rol no definido");
        }
      }
    }
  }, [usuario, loading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Cargando...</Text>
    </View>
  );
}
