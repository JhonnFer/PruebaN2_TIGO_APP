import { useAuth } from "@/src/presentation/hooks/useAuth";
import { usePlanMovil } from "@/src/presentation/hooks/usePlanMovil";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DashboardAsesor() {
  const router = useRouter();
  const { usuario } = useAuth();
  const { planes, cargando, cargarPlanes } = usePlanMovil();

  useEffect(() => {
    cargarPlanes();
  }, []);

  // Filtrar solo los planes del asesor actual
  const misPlanes = planes.filter((plan) => plan.usuarioid === usuario?.usuarioid);

  const handleCrearPlan = () => {
    router.push("/(tabs)/Asesor/crear-plan");
  };

  const handleEditarPlan = (planid: string) => {
    // TODO: Implementar pantalla de editar
    alert("Editar: " + planid);
  };

  const handleEliminarPlan = (planid: string) => {
    // TODO: Implementar eliminación
    alert("Eliminar: " + planid);
  };

  const renderPlan = ({ item }: any) => (
    <View style={styles.planCard}>
      <View style={styles.planInfo}>
        <Text style={styles.planNombre}>{item.nombre}</Text>
        <Text style={styles.planDescripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>

        <View style={styles.caracteristicas}>
          {item.datos && <Text style={styles.car}>💾 {item.datos}GB</Text>}
          {item.minutos && <Text style={styles.car}>📞 {item.minutos}min</Text>}
          {item.velocidad && <Text style={styles.car}>⚡ {item.velocidad}</Text>}
        </View>

        <Text style={styles.planPrecio}>
          ${item.precio?.toLocaleString()} COP/mes
        </Text>

        <Text
          style={[
            styles.estado,
            item.activo ? styles.estadoActivo : styles.estadoInactivo,
          ]}
        >
          {item.activo ? "✓ Activo" : "○ Inactivo"}
        </Text>
      </View>

      <View style={styles.acciones}>
        <TouchableOpacity
          style={styles.botonEditar}
          onPress={() => handleEditarPlan(item.planid)}
        >
          <Text style={styles.textoBoton}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonEliminar}
          onPress={() => handleEliminarPlan(item.planid)}
        >
          <Text style={styles.textoBoton}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Tus planes móviles</Text>
        </View>
        <TouchableOpacity
          style={styles.botonCrear}
          onPress={handleCrearPlan}
        >
          <Text style={styles.textoBotonCrear}>+ Crear</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      {cargando ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#0047B8" />
        </View>
      ) : misPlanes.length === 0 ? (
        <View style={styles.centrado}>
          <Text style={styles.textoVacio}>No has creado planes aún</Text>
          <TouchableOpacity
            style={styles.botonCrearGrande}
            onPress={handleCrearPlan}
          >
            <Text style={styles.textoBotonCrearGrande}>Crear tu primer plan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={misPlanes}
          renderItem={renderPlan}
          keyExtractor={(item) => item.planid}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0047B8",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  botonCrear: {
    backgroundColor: "#00AA00",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  textoBotonCrear: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textoVacio: {
    fontSize: 16,
    color: "#999",
    marginBottom: 16,
  },
  botonCrearGrande: {
    backgroundColor: "#0047B8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  textoBotonCrearGrande: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  planCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  planInfo: {
    padding: 12,
  },
  planNombre: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0047B8",
    marginBottom: 4,
  },
  planDescripcion: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  caracteristicas: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  car: {
    fontSize: 11,
    backgroundColor: "#E3F2FD",
    color: "#0047B8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  planPrecio: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00AA00",
    marginBottom: 4,
  },
  estado: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
  },
  estadoActivo: {
    color: "#00AA00",
  },
  estadoInactivo: {
    color: "#E74C3C",
  },
  acciones: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  botonEditar: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  botonEliminar: {
    flex: 1,
    backgroundColor: "#FFEBEE",
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  textoBoton: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0047B8",
  },
});