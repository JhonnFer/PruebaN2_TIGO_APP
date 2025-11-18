import React from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useSolicitudes } from "../../../src/presentation/hooks/useSolicitudes";
import { useRouter } from "expo-router";

// --- Colores ---
const ASESOR_HEADER_BLUE = "#3498DB";
const BUTTON_APPROVE_GREEN = "#4CAF50";
const BUTTON_REJECT_RED = "#F44336";
const BUTTON_CHAT_BLUE = "#2196F3";
const STATUS_PENDING_YELLOW = "#FFEB3B";
const STATUS_APPROVED_GREEN = "#CCF5D9";

export default function SolicitudesScreen() {
  const { solicitudes, cargando, error, aprobar, rechazar } = useSolicitudes();
  const router = useRouter();

  const handleAprobar = (id: string) => {
    Alert.alert("Confirmar", "¿Aprobar solicitud?", [
      { text: "Cancelar" },
      {
        text: "Sí",
        onPress: async () => {
          try {
            await aprobar(id);
            Alert.alert("Éxito", "Solicitud aprobada");
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  const handleRechazar = (id: string) => {
    Alert.alert("Confirmar", "¿Rechazar solicitud?", [
      { text: "Cancelar" },
      {
        text: "Sí",
        onPress: async () => {
          try {
            await rechazar(id);
            Alert.alert("Éxito", "Solicitud rechazada");
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  const handleChat = (usuarioId: string) => {
    router.push(`/Asesor/chat?usuarioId=${usuarioId}`);
  };

  const renderStatus = (estado: string) => {
    const isPending = estado.toLowerCase() === "pendiente";
    const isApproved = estado.toLowerCase() === "aprobado";
    const backgroundColor = isPending
      ? STATUS_PENDING_YELLOW
      : isApproved
      ? STATUS_APPROVED_GREEN
      : "#D1D5DB";

    return (
      <View style={[styles.statusTag, { backgroundColor }]}>
        <Text style={styles.statusText}>{estado.toUpperCase()}</Text>
      </View>
    );
  };

  if (cargando) return <ActivityIndicator size="large" style={styles.loadingIndicator} />;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solicitudes de Contratación</Text>
        <View style={styles.menuIcon} />
      </View>

      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.solicitudid}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.usuarios?.nombre || "Usuario Desconocido"}</Text>
              {renderStatus(item.estado)}
            </View>

            <Text style={styles.planName}>Plan: {item.planes_moviles?.nombre || "-"}</Text>
            <Text style={styles.cardDate}>
              {item.fecha
                ? new Date(item.fecha)
                    .toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" })
                    .replace(/\//g, "-")
                : "Fecha Desconocida"}
            </Text>

            {item.estado === "pendiente" && (
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: BUTTON_APPROVE_GREEN }]}
                  onPress={() => handleAprobar(item.solicitudid)}
                >
                  <Text style={styles.actionButtonText}>✓ Aprobar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: BUTTON_REJECT_RED, marginRight: 0 }]}
                  onPress={() => handleRechazar(item.solicitudid)}
                >
                  <Text style={styles.actionButtonText}>✕ Rechazar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButtonChat, { backgroundColor: BUTTON_CHAT_BLUE }]}
                  onPress={() => handleChat(item.usuarioid)}
                >
                  <Text style={styles.actionButtonText}>💬</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6E6FA" },
  header: {
    backgroundColor: ASESOR_HEADER_BLUE,
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  menuIcon: { width: 30, height: 30, backgroundColor: "#fff", borderRadius: 5, opacity: 0.2 },
  listContent: { padding: 16, paddingBottom: 30 },
  loadingIndicator: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { textAlign: "center", color: BUTTON_REJECT_RED, marginTop: 50 },

  card: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  planName: { fontSize: 14, color: "#555", marginBottom: 5 },
  cardDate: { fontSize: 12, color: "#999", marginBottom: 15 },

  statusTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15, alignSelf: "flex-start", borderWidth: 1, borderColor: "#E0E0E0" },
  statusText: { fontSize: 10, fontWeight: "bold", color: "#333" },

  cardActions: { flexDirection: "row", marginTop: 8, justifyContent: "space-between" },
  actionButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center", marginRight: 8 },
  actionButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  actionButtonChat: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
});
