// app/Perfiles/usuario.tsx

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { useRouter } from "expo-router";

export default function UsuarioDashboard() {
  const { usuario, logout } = useAuth(); // También traemos logout
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenido {usuario?.nombre}</Text>
      <Text style={styles.subtitle}>(Usuario Registrado)</Text>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/planes/catalogo")}
        >
          <Text style={styles.buttonText}>📱 Ver Planes Móviles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/contrataciones")}
        >
          <Text style={styles.buttonText}>📦 Mis Contrataciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/chat")}
        >
          <Text style={styles.buttonText}>💬 Chat con Asesor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/auth/forgot-password")}
        >
          <Text style={styles.buttonText}>🔑 Restablecer Contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => logout(router)}
        >
          <Text style={styles.buttonText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f9fafb",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: 20,
  },
  menu: {
    width: "100%",
    gap: 12,
  },
  menuButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
