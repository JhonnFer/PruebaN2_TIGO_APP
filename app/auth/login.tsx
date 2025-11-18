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

  // ---------------------- Login como Usuario Registrado ----------------------
  const handleLoginUsuario = async () => {
    try {
      const user = await login(email, contrasena, router, "Usuario");
      alert(`Bienvenido ${user.nombre} (Usuario Registrado)`);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  // ---------------------- Login como Asesor Comercial ----------------------
  const handleLoginAsesor = async () => {
    try {
      const user = await login(email, contrasena, router, "Asesor");
      alert(`Bienvenido ${user.nombre} (Asesor Comercial)`);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  // ---------------------- Login Invitado ----------------------
  const handleInvitado = () => {
    const invitado = loginInvitado();
    alert(`Bienvenido ${invitado.nombre} (Invitado)`);
    router.replace("/explore");
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

      {/* Botón de Login Usuario */}
      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonPrimary, { width: "100%" }]}
        onPress={handleLoginUsuario}
        disabled={loading}
      >
        <Text style={globalStyles.buttonText}>
          {loading ? "Ingresando..." : "Ingresar como Usuario"}
        </Text>
      </TouchableOpacity>

      {/* Botón de Login Asesor */}
      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonSecondary, { width: "100%", marginTop: 10 }]}
        onPress={handleLoginAsesor}
        disabled={loading}
      >
        <Text style={globalStyles.buttonText}>
          {loading ? "Ingresando..." : "Ingresar como Asesor"}
        </Text>
      </TouchableOpacity>

      {/* Botón Login Invitado */}
      <TouchableOpacity
        style={[globalStyles.button, { width: "100%", backgroundColor: "#AAA", marginTop: 10 }]}
        onPress={handleInvitado}
      >
        <Text style={globalStyles.buttonText}>Entrar como Invitado</Text>
      </TouchableOpacity>

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
