//app/(tabs)/Registrado/perfil.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { Feather } from "@expo/vector-icons"; // Iconos Feather

export default function PerfilTab() {
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  return (
    <View style={styles.container}>
      {/* Icono grande arriba */}
      <Feather name="user" size={80} color="#007AFF" style={{ marginBottom: 20 }} />

      <Text style={styles.nombre}>{usuario.nombre}</Text>
      <Text style={styles.info}>Email: {usuario.email}</Text>
      <Text style={styles.info}>Rol: {usuario.role}</Text>
      {usuario.telefono && <Text style={styles.info}>Teléfono: {usuario.telefono}</Text>}

      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  nombre: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
