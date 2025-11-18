// app/(tabs)/Registrado/MisPlanes.tsx
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Alert } from "react-native";
import { usePlanMovil } from "../../../src/presentation/hooks/usePlanMovil";

export default function MisPlanes() {
  const { planesContratados, contratarPlan } = usePlanMovil();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const renderStatusTag = (estado: string) => {
    const base = [styles.statusTag];
    if (estado === "PENDIENTE") base.push(styles.statusPending);
    if (estado === "APROBADO") base.push(styles.statusApproved);
    return <Text style={base}>{estado}</Text>;
  };

  const handleContratar = async (plan: any) => {
    setLoading(true);
    try {
      await contratarPlan(plan.planid);
      Alert.alert("Plan Contratado", "El plan se añadió a Mis Planes");
      setSelectedPlan(null); // cerrar modal
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo contratar el plan");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.contractCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.planName}>{item.nombre}</Text>
          <Text style={styles.planDate}>Fecha: {item.fecha}</Text>
        </View>
        {renderStatusTag(item.estado)}
      </View>

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setSelectedPlan(item)} // Abrir modal
      >
        <Text style={styles.chatButtonText}>Ver Detalle / Contratar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Usuario Registrado</Text>
        <Text style={styles.headerSubtitle}>Mis Contrataciones</Text>
      </View>

      <FlatList
        data={planesContratados}
        keyExtractor={(item) => item.planid}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />

      {/* MODAL DETALLE PLAN */}
      <Modal visible={!!selectedPlan} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedPlan ? (
              <>
                <Text style={styles.planName}>{selectedPlan.nombre}</Text>
                <Text style={styles.planDescription}>{selectedPlan.descripcion}</Text>
                <Text style={styles.planDetails}>💻 {selectedPlan.gigas} GB | 📞 {selectedPlan.minutos} min</Text>
                <Text style={styles.planPrice}>${selectedPlan.precio}</Text>

                <TouchableOpacity
                  style={styles.contractButton}
                  onPress={() => handleContratar(selectedPlan)}
                  disabled={loading}
                >
                  <Text style={styles.contractButtonText}>{loading ? "Contratando..." : "Contratar"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPlan(null)}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <ActivityIndicator size="large" />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  header: { backgroundColor: "#004488", padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: "white", fontWeight: "600" },
  headerSubtitle: { color: "white", fontSize: 18, fontWeight: "700" },
  contractCard: { backgroundColor: "white", borderRadius: 12, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  planName: { fontWeight: "600", fontSize: 16, color: "#333" },
  planDate: { fontSize: 14, color: "#666", marginTop: 4 },
  statusTag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, fontSize: 12, fontWeight: "700", textTransform: "uppercase" },
  statusPending: { backgroundColor: "#ffe0b2", color: "#795548" },
  statusApproved: { backgroundColor: "#c8e6c9", color: "#388e3c" },
  chatButton: { width: "100%", padding: 12, backgroundColor: "#1e88e5", borderRadius: 8, justifyContent: "center", alignItems: "center" },
  chatButtonText: { color: "white", fontWeight: "600", fontSize: 16 },

  // MODAL
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", backgroundColor: "white", borderRadius: 12, padding: 20, alignItems: "center" },
  planDescription: { fontSize: 16, color: "#666", marginVertical: 8 },
  planDetails: { fontSize: 16, color: "#333", marginBottom: 8 },
  planPrice: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  contractButton: { backgroundColor: "#4CAF50", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  contractButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  closeButton: { marginTop: 10, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#f44336", borderRadius: 8 },
  closeButtonText: { color: "#fff", fontWeight: "600" },
});
