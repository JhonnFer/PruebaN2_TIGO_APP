// app/Planes/PlanesCRUD.tsx
import { supabase } from "@/src/data/services/supabaseClient";
import { usePermisos } from "@/src/presentation/hooks/usePermisos";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { usePlanMovil } from "../../../src/presentation/hooks/usePlanMovil";

export default function PlanesCRUD() {
  const { planes, cargando, error, cargarPlanes, eliminarPlan } = usePlanMovil();
  const { puedeCrear, puedeEliminar } = usePermisos();

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleCrear = async () => {
    if (!puedeCrear) return Alert.alert("Error", "No tienes permisos para crear planes");
    try {
      const { error } = await supabase.from("planes_moviles").insert([
        { nombre, precio: parseFloat(precio), descripcion },
      ]);
      if (error) throw new Error(error.message);
      Alert.alert("Éxito", "Plan creado");
      setNombre("");
      setPrecio("");
      setDescripcion("");
      cargarPlanes();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!puedeEliminar) return Alert.alert("Error", "No tienes permisos para eliminar");
    const result = await eliminarPlan(id);
    if (result.success) cargarPlanes();
    else Alert.alert("Error", result.error);
  };

  if (cargando) return <ActivityIndicator size="large" style={styles.container} />;
  if (error)
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {puedeCrear && (
        <View style={styles.form}>
          <TextInput
            placeholder="Nombre del plan"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            placeholder="Precio"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            style={styles.input}
          />
          <Button title="Crear Plan" onPress={handleCrear} />
        </View>
      )}

      <FlatList
        data={planes}
        keyExtractor={(item) => item.planid}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.precio}>${item.precio}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            {puedeEliminar && <Button title="Eliminar" onPress={() => handleEliminar(item.planid)} />}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  form: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#3366FF",
  },
  nombre: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  precio: { fontSize: 16, color: "#fff", marginTop: 4 },
  descripcion: { fontSize: 14, color: "#fff", marginTop: 4 },
});
