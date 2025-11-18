// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Tigo App</Text>
      <Text style={styles.subtitle}>Selecciona una opción para continuar:</Text>

      {/* Botón Invitado */}
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary]}
        onPress={() => router.push("/(tabs)/Invitado")}
      >
        <Text style={styles.buttonText}>Ingresar como Invitado</Text>
      </TouchableOpacity>

      {/* Botón Iniciar Sesión */}
      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Botón Registrarse */}
      <TouchableOpacity
        style={[styles.button, styles.buttonTertiary]}
        onPress={() => router.push("/auth/registro")}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  subtitle: { fontSize: 16, marginBottom: 24, color: "#555" },
  button: {
    width: "80%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonPrimary: { backgroundColor: "#4CAF50" },
  buttonSecondary: { backgroundColor: "#2196F3" },
  buttonTertiary: { backgroundColor: "#FF9800" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
