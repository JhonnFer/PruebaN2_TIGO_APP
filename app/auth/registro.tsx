import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { globalStyles } from "@/src/styles/globalStyles";
import { useRouter } from "expo-router";

export default function RegistroScreen() {
  const { registrar, error, loading } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState(""); // variable interna, se envía como password
  const [telefono, setTelefono] = useState(""); // nuevo campo para teléfono
  const router = useRouter();

  const handleRegistro = async () => {
    try {
      await registrar(nombre, email, contrasena, telefono); // el hook maneja alerts

      // Redirigir al login después del registro exitoso
      router.replace("/auth/login");

      // Opcional: limpiar inputs si quieres
      setNombre("");
      setEmail("");
      setContrasena("");
    } catch (e) {
      console.log("Error en handleRegistro:", e);
    }
  };

  return (
    <View style={globalStyles.containerCentered}>
      <Text style={globalStyles.title}>Registro</Text>

      <TextInput
        style={[globalStyles.input, { width: "100%" }]}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={[globalStyles.input, { width: "100%" }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
  style={[globalStyles.input, { width: "100%" }]}
  placeholder="Teléfono"
  value={telefono}
  onChangeText={setTelefono}
  keyboardType="phone-pad"
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
        style={[
          globalStyles.button,
          globalStyles.buttonPrimary,
          { width: "100%", opacity: loading ? 0.7 : 1 },
        ]}
        onPress={handleRegistro}
        disabled={loading}
      >
        <Text style={globalStyles.buttonText}>
          {loading ? "Registrando..." : "Registrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/login")}
        style={{ marginTop: 15 }}
      >
        <Text style={{ color: globalStyles.textPrimary.color, fontWeight: "600" }}>
          ¿Ya tienes cuenta? Iniciar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
