// app/(tabs)/Registrado/index.tsx
import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { usePlanMovil } from "../../../src/presentation/hooks/usePlanMovil";
import { usePermisos } from "../../../src/presentation/hooks/usePermisos";

export default function CatalogoPlanes() {
  const router = useRouter();
  const { planes, cargando, error, buscarPlan } = usePlanMovil();
  const { puedeVerCatalogo } = usePermisos();
  const [searchTerm, setSearchTerm] = useState("");

  if (!puedeVerCatalogo) {
    return (
      <View style={styles.centered}>
        <Text>No tienes permisos para ver los planes.</Text>
      </View>
    );
  }

  const handleSearch = () => buscarPlan(searchTerm);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.planName}>{item.nombre}</Text>
      <Text style={styles.planDescription}>{item.descripcion}</Text>
      <Text style={styles.planDetails}>💻 {item.gigas} GB | 📞 {item.minutos} min</Text>
      <Text style={styles.planPrice}>${item.precio}</Text>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => router.push(`/tabs/Registrado/DetallePlan?planid=${item.planid}`)}
      >
        <Text style={styles.detailsButtonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar plan..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Planes Disponibles</Text>

      {cargando ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : (
        <FlatList
          data={planes}
          keyExtractor={(item) => item.planid}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f6f9" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchContainer: { flexDirection: "row", marginBottom: 16 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 },
  searchButton: { marginLeft: 8, backgroundColor: "#4CAF50", borderRadius: 8, justifyContent: "center", paddingHorizontal: 12 },
  searchButtonText: { color: "#fff", fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 3 },
  planName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  planDescription: { fontSize: 14, color: "#666", marginBottom: 4 },
  planDetails: { fontSize: 14, color: "#333", marginBottom: 4 },
  planPrice: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  detailsButton: { backgroundColor: "#1e88e5", padding: 12, borderRadius: 8, alignItems: "center" },
  detailsButtonText: { color: "#fff", fontWeight: "600" },
});
