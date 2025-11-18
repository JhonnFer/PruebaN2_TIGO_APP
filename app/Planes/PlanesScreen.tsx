// app/Planes/PlanesScreen.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { usePlanMovil } from "../../src/presentation/hooks/usePlanMovil";

import { globalStyles } from "@/src/styles/globalStyles";
import { colors, fontSize, spacing } from "@/src/styles/theme";

export default function PlanesScreen() {
  const { usuario, cerrarSesion } = useAuth();
  const { planes, cargando, cargarPlanes, buscarPlan, eliminarPlan } = usePlanMovil();
  const [busqueda, setBusqueda] = useState("");
  const [refrescando, setRefrescando] = useState(false);
  const router = useRouter();

  const handleBuscar = () => {
    if (busqueda.trim()) {
      buscarPlan(busqueda.trim().toLowerCase());
    } else {
      cargarPlanes();
    }
  };

  const handleRefresh = async () => {
    setRefrescando(true);
    await cargarPlanes();
    setRefrescando(false);
  };

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    router.replace("/auth/login");
  };

  const handleEliminar = (planId: string) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este plan móvil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const resultado = await eliminarPlan(planId);
            if (resultado.success) {
              Alert.alert("Éxito", "Plan eliminado correctamente");
              cargarPlanes();
            } else {
              Alert.alert("Error", resultado.error || "No se pudo eliminar");
            }
          },
        },
      ]
    );
  };

  if (!usuario) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <View>
          <Text style={styles.saludo}>¡Hola!</Text>
          <Text style={globalStyles.textSecondary}>{usuario.email}</Text>
        </View>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonDanger, styles.botonCerrar]}
          onPress={handleCerrarSesion}
        >
          <Text style={globalStyles.buttonText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonPrimary, styles.botonCrear]}
        onPress={() => router.push("/planes/crear")}
      >
        <Text style={globalStyles.buttonText}>➕ Crear Plan</Text>
      </TouchableOpacity>

      {cargando ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: spacing.lg }}
        />
      ) : (
        <FlatList
          data={planes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md }}
          refreshControl={
            <RefreshControl refreshing={refrescando} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <Text style={globalStyles.emptyState}>
              No hay planes móviles registrados.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <View style={styles.infoPlan}>
                <Text style={styles.nombrePlan}>{item.nombre}</Text>
                <Text style={globalStyles.textSecondary}>
                  💲 {item.precio} - {item.descripcion}
                </Text>
              </View>

              <View style={styles.botonesAccion}>
                <TouchableOpacity
                  style={[globalStyles.button, globalStyles.buttonSecondary, styles.botonAccion]}
                  onPress={() => router.push(`/planes/editar?id=${item.id}`)}
                >
                  <Text style={globalStyles.buttonText}>✏️ Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[globalStyles.button, globalStyles.buttonDanger, styles.botonAccion]}
                  onPress={() => handleEliminar(item.id)}
                >
                  <Text style={globalStyles.buttonText}>🗑️ Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  saludo: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  botonCerrar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  botonCrear: {
    marginVertical: spacing.md,
  },
  infoPlan: {
    paddingTop: spacing.md,
  },
  nombrePlan: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  botonesAccion: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  botonAccion: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
});
