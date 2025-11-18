// app/auth/recuperar.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from "@/src/styles/globalStyles";
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
    <View style={globalStyles.containerCentered}>
      {/* ---------- Botón Volver ---------- */}
      <TouchableOpacity
        onPress={() => router.replace("/auth/login")}
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          padding: 10,
          backgroundColor: "#CCC",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#000", fontWeight: "600" }}>← Volver</Text>
      </TouchableOpacity>

      <Text style={globalStyles.title}>Recuperar Contraseña</Text>
      <Text style={{ ...globalStyles.subtitle, marginBottom: 20 }}>
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </Text>

      <TextInput
        style={[globalStyles.input, { width: "100%" }]}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonPrimary, { width: "100%", marginTop: 15 }]}
        onPress={handleRecuperar}
        disabled={loading}
      >
        <Text style={globalStyles.buttonText}>
          {loading ? "Enviando..." : "Enviar Instrucciones"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
