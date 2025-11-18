import { useAuth } from "@/src/presentation/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const BUTTON_PRIMARY_BLUE = "#3498DB"; // Azul brillante
const BORDER_GRAY = "#D1D5DB";
const BACKGROUND_LAVENDER = "#AFAEC8";

export default function RegistroScreen() {
  const { registrar, error, loading } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const router = useRouter();

  const handleRegistro = async () => {
    if (!nombre || !email || !contrasena || !telefono) return;

    try {
      await registrar(nombre, email, contrasena, telefono);
      router.replace("/auth/login");
      setNombre(""); setEmail(""); setContrasena(""); setTelefono("");
    } catch (e: any) {
      console.log("Error en handleRegistro:", e.message);
    }
  };

  const isDisabled = loading || !nombre || !email || !contrasena || !telefono;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <Text style={styles.label}>Nombre Completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Juan Pérez"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#9CA3AF"
      />

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

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="0999123456"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
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

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleRegistro}
        disabled={isDisabled}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear Cuenta</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/login")}
        style={{ marginTop: 15 }}
      >
        <Text style={styles.linkText}>¿Ya tienes cuenta? Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: BACKGROUND_LAVENDER,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#1F2937',
    textAlign: 'center',
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
    marginTop: 10,
    minHeight: 55,
    justifyContent: 'center',
    backgroundColor: BUTTON_PRIMARY_BLUE,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  error: {
    color: "#EF4444",
    marginBottom: 15,
    fontWeight: '500',
  },
  linkText: {
    color: BUTTON_PRIMARY_BLUE,
    fontWeight: "600",
    fontSize: 15,
    textAlign: 'center',
  },
});
