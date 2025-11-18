// app/(tabs)/Registrado/perfil.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// --- Colores y constantes ---
const HEADER_BLUE = "#3498DB";
const PRIMARY_BLUE = "#007AFF";
const DANGER_RED = "#FF3B30";
const BACKGROUND_LAVANDA = "#E6E6FA";
const CARD_COLOR = "#FFFFFF";

export default function PerfilTab() {
  const { usuario, logout } = useAuth();
  const router = useRouter();

  if (!usuario) return null;

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  const handleEditProfile = () => {
    alert("Función Editar Perfil no implementada aún.");
  };

  const InfoCard = ({ iconName, label, value }: { iconName: string; label: string; value: string | undefined }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoRow}>
        <View style={styles.infoIconCircle}>
          <MaterialIcons name={iconName} size={20} color={PRIMARY_BLUE} />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tag de Usuario Registrado */}
      <View style={styles.tag}>
        <Text style={styles.tagText}>Usuario Registrado</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={styles.menuIconPlaceholder}>
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View style={styles.contentContainer}>
        {/* Tarjeta de Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {usuario.nombre ? usuario.nombre[0].toUpperCase() : "?"}
            </Text>
          </View>
          <Text style={styles.nombre}>{usuario.nombre}</Text>
          <Text style={styles.subtext}>{usuario.email}</Text>
        </View>

        {/* Tarjetas de Contacto */}
        <View style={styles.contactContainer}>
          <InfoCard iconName="email" label="Email" value={usuario.email} />
          {usuario.telefono && <InfoCard iconName="phone-android" label="Teléfono" value={usuario.telefono} />}
        </View>

        {/* Botones */}
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_LAVANDA,
  },
  header: {
    backgroundColor: HEADER_BLUE,
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginLeft: -30,
  },
  menuIconPlaceholder: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  tag: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    position: "absolute",
    top: 55,
    left: 15,
    zIndex: 10,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  profileCard: {
    backgroundColor: CARD_COLOR,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: CARD_COLOR,
  },
  nombre: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 2,
    color: "#333",
  },
  subtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  contactContainer: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: CARD_COLOR,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  editButton: {
    paddingVertical: 15,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    paddingVertical: 15,
    backgroundColor: DANGER_RED,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
