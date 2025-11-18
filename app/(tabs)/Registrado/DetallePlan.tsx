// app/(tabs)/Registrado/DetallePlan.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { usePlanMovil } from "../../../src/presentation/hooks/usePlanMovil";

export default function DetallePlan() {
  const { planid } = useSearchParams();
  const router = useRouter();
  const { obtenerPlanPorId, contratarPlan } = usePlanMovil();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (planid) {
      const p = obtenerPlanPorId(planid as string);
      setPlan(p);
    }
  }, [planid]);

  if (!plan) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;

  const handleContratar = async () => {
    setLoading(true);
    try {
      await contratarPlan(plan.planid);
      Alert.alert("Plan Contratado", "El plan se añadió a Mis Planes");
      router.push("/tabs/Registrado/MisPlanes");
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo contratar el plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.planName}>{plan.nombre}</Text>
      <Text style={styles.planDescription}>{plan.descripcion}</Text>
      <Text style={styles.planDetails}>💻 {plan.gigas} GB | 📞 {plan.minutos} min</Text>
      <Text style={styles.planPrice}>${plan.precio}</Text>

      <TouchableOpacity style={styles.contractButton} onPress={handleContratar} disabled={loading}>
        <Text style={styles.contractButtonText}>{loading ? "Contratando..." : "Contratar"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f6f9", justifyContent: "center" },
  planName: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  planDescription: { fontSize: 16, color: "#666", marginBottom: 8 },
  planDetails: { fontSize: 16, color: "#333", marginBottom: 8 },
  planPrice: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  contractButton: { backgroundColor: "#4CAF50", padding: 14, borderRadius: 8, alignItems: "center" },
  contractButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
