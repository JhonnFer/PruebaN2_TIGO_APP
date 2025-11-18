import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { globalStyles } from "@/src/styles/globalStyles";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { login, loginInvitado, error, loading, usuario } = useAuth();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await login(email, contrasena);
      alert(`Bienvenido ${user.nombre} (${user.role})`);
      router.push("/"); // Redirige al dashboard o pantalla principal
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  const handleInvitado = () => {
    const invitado = loginInvitado();
    alert(`Bienvenido ${invitado.nombre} (${invitado.role})`);
    router.push("/"); // Redirige al dashboard como invitado
  };

  return (
    <View style={globalStyles.containerCentered}>
      <Text style={globalStyles.title}>Iniciar Sesión</Text>

      <TextInput
        style={[globalStyles.input, { width: "100%" }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={[globalStyles.input, { width: "100%" }]}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      {error && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}

      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonPrimary, { width: "100%" }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={globalStyles.buttonText}>
          {loading ? "Ingresando..." : "Login"}
        </Text>
      </TouchableOpacity>

      {/* Botón para invitado */}
      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonSecondary, { width: "100%", marginTop: 10 }]}
        onPress={handleInvitado}
      >
        <Text style={globalStyles.buttonText}>Entrar como Invitado</Text>
      </TouchableOpacity>

      {/* Enlace a registro */}
      <TouchableOpacity onPress={() => router.push("/auth/registro")} style={{ marginTop: 15 }}>
        <Text style={{ color: globalStyles.textPrimary.color, fontWeight: "600" }}>
          ¿No tienes cuenta? Registrarse
        </Text>
      </TouchableOpacity>

      {usuario && (
        <Text style={{ marginTop: 20, color: globalStyles.textPrimary.color }}>
          Usuario activo: {usuario.nombre} ({usuario.role})
        </Text>
      )}
    </View>
  );
}
