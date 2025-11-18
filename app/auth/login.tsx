import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { globalStyles } from "@/src/styles/globalStyles";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { login, error, loading, usuario } = useAuth();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  // ---------------------- Login como Usuario Registrado ----------------------
  const handleLoginUsuario = async () => {
    try {
      const user = await login(email, contrasena, "Registrado");
      alert(`Bienvenido ${user.nombre} (Usuario Registrado)`);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  // ---------------------- Login como Asesor Comercial ----------------------
  const handleLoginAsesor = async () => {
    try {
      const user = await login(email, contrasena, "Asesor");
      alert(`Bienvenido ${user.nombre} (Asesor Comercial)`);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  return (
    <View style={globalStyles.containerCentered}>
      {/* ---------- Botón Volver ---------- */}
      <TouchableOpacity
        onPress={() => router.replace("/")}
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

      {/* Enlace a recuperación de contraseña */}
      <TouchableOpacity onPress={() => router.push("/auth/recuperar")} style={{ marginTop: 15 }}>
        <Text style={[globalStyles.textPrimary, { fontWeight: "600" }]}>
          ¿Olvidaste tu contraseña?
        </Text>
      </TouchableOpacity>

      {/* Mostrar info de usuario activo */}
      {usuario && (
        <Text style={[globalStyles.textPrimary, { marginTop: 20 }]}>
          Usuario activo: {usuario.nombre} ({usuario.role})
        </Text>
      )}
    </View>
  );
}
