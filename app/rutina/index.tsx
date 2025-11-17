import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useRutina } from "@/src/presentation/hooks/useRutina";




export default function RutinaList() {
  const router = useRouter();
  const { data: rutinas, isLoading, isError } = useRutinas();

  if (isLoading) return <LoadingScreen />;
  if (isError) return <Text>Error cargando rutinas</Text>;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Rutinas asignadas
      </Text>

      <FlatList
        data={rutinas}
        keyExtractor={(item) => item.id} // 🔑 Asegúrate de tener un campo `id` en la rutina
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 16,
              marginBottom: 12,
              backgroundColor: "#E3F2FD",
              borderRadius: 8,
            }}
            onPress={() => router.push(`/rutina/editar?id=${item.id}`)}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.titulo}
            </Text>
            <Text style={{ fontSize: 14, color: "#555" }}>
              {item.descripcion}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
