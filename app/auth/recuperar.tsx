// app/auth/recuperar.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/presentation/hooks/useAuth";

export default function RecuperarPasswordScreen() {
  const router = useRouter();
  const { recuperarPassword, loading } = useAuth();
  const [email, setEmail] = useState("");

  const handleRecuperar = async () => {
    try {
      if (!email) {
        Alert.alert("Error", "Por favor ingresa tu correo.");
        return;
      }

      await recuperarPassword(email);
      Alert.alert(
        "Correo Enviado",
        "Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña."
      );
    } catch (e: any) {
      Alert.alert("Error", e.message || "Algo salió mal");
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón Volver */}
      <TouchableOpacity
        onPress={() => router.replace("/auth/login")}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Recuperar Contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRecuperar}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Enviando..." : "Enviar Instrucciones"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10, backgroundColor: "#CCC", borderRadius: 8 },
  backText: { color: "#000", fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  button: { width: "100%", padding: 12, borderRadius: 10, backgroundColor: "#4CAF50", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
