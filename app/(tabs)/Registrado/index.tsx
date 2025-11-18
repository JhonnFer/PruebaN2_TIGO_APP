import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../src/presentation/hooks/useAuth";
import { usePermisos } from "../../../src/presentation/hooks/usePermisos";
import { usePlanMovil } from "../../../src/presentation/hooks/usePlanMovil";

export default function CatalogoPlanes() {
  const router = useRouter();
  const { usuario } = useAuth();
  const { planes, cargando, error } = usePlanMovil();
  const { puedeVerCatalogo } = usePermisos();
  const [searchTerm, setSearchTerm] = useState("");

  if (!usuario) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!puedeVerCatalogo) {
    return (
      <View style={styles.centered}>
        <Text>No tienes permisos para ver los planes.</Text>
      </View>
    );
  }

  const filteredPlanes = planes.filter(plan =>
    plan.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPlan = ({ item }: any) => (
    <View style={styles.planCard}>
      {item.imagen_url ? (
        <Image source={{ uri: item.imagen_url }} style={styles.planImagen} />
      ) : (
        <View style={[styles.planImagen, styles.imagenPlaceholder]}>
          <Text style={styles.textoImagen}>📱</Text>
        </View>
      )}
      <View style={styles.planContenido}>
        <Text style={styles.planNombre}>{item.nombre}</Text>
        <Text style={styles.planDescripcion}>{item.descripcion}</Text>
        <View style={styles.caracteristicas}>
          {item.datos && <Text style={styles.caracteristica}>💾 {item.datos} GB</Text>}
          {item.minutos && <Text style={styles.caracteristica}>📞 {item.minutos} min</Text>}
          {item.sms && <Text style={styles.caracteristica}>💬 {item.sms} SMS</Text>}
        </View>
        <Text style={styles.planPrecio}>${item.precio?.toLocaleString()}</Text>
        <TouchableOpacity
          style={styles.botonDetalles}
          onPress={() => router.push({
            pathname: '/(tabs)/Registrado/detalle-plan/[id]',
            params: { id: item.planid }
          })}
        >
          <Text style={styles.textoBotonDetalles}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tigo Conecta</Text>
        <Text style={styles.headerSubtitle}>Mis Planes Disponibles</Text>
      </View>

      <View style={styles.busqueda}>
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar planes..."
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.botonBusqueda}>
          <Text style={styles.textoBusqueda}>🔍</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0047B8" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.textoError}>{error}</Text>
        </View>
      ) : filteredPlanes.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.textoVacio}>No hay planes disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlanes}
          keyExtractor={(item) => item.planid}
          renderItem={renderPlan}
          contentContainerStyle={styles.flatListContent}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#0047B8",
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  busqueda: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  inputBusqueda: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 14,
  },
  botonBusqueda: {
    backgroundColor: "#0047B8",
    borderRadius: 12,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBusqueda: {
    fontSize: 18,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  planCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  planImagen: {
    width: "100%",
    height: 200,
    backgroundColor: "#E3F2FD",
  },
  imagenPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  textoImagen: {
    fontSize: 64,
  },
  planContenido: {
    padding: 16,
  },
  planNombre: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0047B8",
    marginBottom: 8,
  },
  planDescripcion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  caracteristicas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  caracteristica: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    color: "#0047B8",
    fontWeight: "600",
  },
  planPrecio: {
    fontSize: 24,
    fontWeight: "700",
    color: "#00AA00",
    marginBottom: 12,
  },
  botonDetalles: {
    backgroundColor: "#0047B8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotonDetalles: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  textoError: {
    color: "#D32F2F",
    fontSize: 16,
  },
  textoVacio: {
    color: "#999",
    fontSize: 16,
  },
});
