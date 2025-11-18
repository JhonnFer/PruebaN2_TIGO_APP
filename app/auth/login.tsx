import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { useRouter } from "expo-router";

const BUTTON_PRIMARY_BLUE = "#3498DB";
const BUTTON_SECONDARY_GREEN = "#1ABC9C";
const BORDER_GRAY = "#D1D5DB";

export default function LoginScreen() {
  const { login, error, loading, usuario } = useAuth();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!usuario) return;
    if (usuario.role === "Registrado") router.replace("/(tabs)/Registrado");
    else if (usuario.role === "Asesor") router.replace("/(tabs)/Asesor");
  }, [usuario]);

  const handleLoginUsuario = async () => {
    if (!email || !contrasena) {
      Alert.alert("Error", "Por favor, ingresa tu email y contraseña.");
      return;
    }
    try {
      const user = await login(email, contrasena, "Registrado");
      Alert.alert("Bienvenido", `${user.nombre} (Usuario Registrado)`);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleLoginAsesor = async () => {
    if (!email || !contrasena) {
      Alert.alert("Error", "Por favor, ingresa tu email y contraseña.");
      return;
    }
    try {
      const user = await login(email, contrasena, "Asesor");
      Alert.alert("Bienvenido", `${user.nombre} (Asesor Comercial)`);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const isDisabled = loading || !email || !contrasena;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="tu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        placeholderTextColor="#9CA3AF"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Botones */}
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary, isDisabled && styles.buttonDisabled]}
        onPress={handleLoginUsuario}
        disabled={isDisabled}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar como Usuario</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary, isDisabled && styles.buttonDisabled]}
        onPress={handleLoginAsesor}
        disabled={isDisabled}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar como Asesor</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/recuperar")} style={styles.recoverLink}>
        <Text style={styles.recoverText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      {usuario && <Text style={styles.activeUser}>Usuario activo: {usuario.nombre} ({usuario.role})</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#1F2937',
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  button: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    minHeight: 55,
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: BUTTON_PRIMARY_BLUE,
  },
  buttonSecondary: {
    backgroundColor: BUTTON_SECONDARY_GREEN,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 15,
    fontWeight: '500',
  },
  recoverLink: {
    marginTop: 10,
    alignSelf: 'center',
  },
  recoverText: {
    color: BUTTON_SECONDARY_GREEN,
    fontWeight: "600",
    fontSize: 15,
  },
  activeUser: {
    marginTop: 30,
    color: "#6B7280",
    fontSize: 14,
    textAlign: 'center',
  },
});
