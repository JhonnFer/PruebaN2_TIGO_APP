import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { login, error, loading, usuario } = useAuth();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  // Si el usuario ya está logueado, redirige automáticamente al tab correspondiente
  useEffect(() => {
    if (!usuario) return;

    if (usuario.role === "Registrado") {
      router.replace("/(tabs)/Registrado");
    } else if (usuario.role === "Asesor") {
      router.replace("/(tabs)/Asesor");
    }
  }, [usuario]);

  const handleLoginUsuario = async () => {
    try {
      const user = await login(email, contrasena, "Registrado");
      Alert.alert("Bienvenido", `${user.nombre} (Usuario Registrado)`);
      // La redirección al tab se maneja en el useEffect
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleLoginAsesor = async () => {
    try {
      const user = await login(email, contrasena, "Asesor");
      Alert.alert("Bienvenido", `${user.nombre} (Asesor Comercial)`);
      // La redirección al tab se maneja en el useEffect
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón Volver */}
      <TouchableOpacity
        onPress={() => router.replace("/")}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Botones de login */}
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary]}
        onPress={handleLoginUsuario}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Ingresando..." : "Ingresar como Usuario"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={handleLoginAsesor}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Ingresando..." : "Ingresar como Asesor"}
        </Text>
      </TouchableOpacity>

      {/* Recuperar contraseña */}
      <TouchableOpacity onPress={() => router.push("/auth/recuperar")} style={{ marginTop: 15 }}>
        <Text style={styles.recoverText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      {/* Usuario activo */}
      {usuario && (
        <Text style={styles.activeUser}>
          Usuario activo: {usuario.nombre} ({usuario.role})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10, backgroundColor: "#CCC", borderRadius: 8 },
  backText: { color: "#000", fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
  button: { width: "100%", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  buttonPrimary: { backgroundColor: "#4CAF50" },
  buttonSecondary: { backgroundColor: "#2196F3" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  errorText: { color: "red", marginBottom: 10 },
  recoverText: { color: "#4CAF50", fontWeight: "600" },
  activeUser: { marginTop: 20, color: "#333" },
});
