import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/presentation/hooks/useAuth";

export default function TabsEntry() {
  const { usuario } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!usuario) return;

    if (usuario.role === "Asesor") router.replace("/(tabs)/Asesor");
    else if (usuario.role === "Registrado") router.replace("/(tabs)/Registrado");
    else router.replace("/(tabs)/Invitado");
  }, [usuario]);

  // Contenedor principal para asegurar que la barra de tabs respete el safe area
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0047B8" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
