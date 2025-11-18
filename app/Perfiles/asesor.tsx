// app/Perfiles/asesor.tsx

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { useRouter } from "expo-router";

export default function AsesorDashboard() {
  const { usuario, logout } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenido {usuario?.nombre}</Text>
      <Text style={styles.subtitle}>(Asesor Comercial)</Text>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/planes")}
        >
          <Text style={styles.buttonText}>📋 Gestión de Planes (CRUD)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/planes/subir-imagen")}
        >
          <Text style={styles.buttonText}>🖼️ Subir Imágenes Promocionales</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/chat")}
        >
          <Text style={styles.buttonText}>💬 Responder Consultas (Chat)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/solicitudes")}
        >
          <Text style={styles.buttonText}>📦 Ver Solicitudes de Contratación</Text>
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
    backgroundColor: "#1d4ed8",
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
