// app/(tabs)/Registrado/MisPlanes.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { usePlanMovil } from "../../../src/presentation/hooks/usePlanMovil";

export default function MisPlanes() {
  const { planesContratados } = usePlanMovil();

  const renderStatusTag = (estado: string) => {
    const base = [styles.statusTag];
    if (estado === "PENDIENTE") base.push(styles.statusPending);
    if (estado === "APROBADO") base.push(styles.statusApproved);
    return <Text style={base}>{estado}</Text>;
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

      <TouchableOpacity style={styles.chatButton}>
        <Text style={styles.chatButtonText}>💬 Chat con Asesor</Text>
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
});
