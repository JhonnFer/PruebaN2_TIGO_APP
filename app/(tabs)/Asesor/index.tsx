// app/Planes/PlanesGestion.tsx
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { usePermisos } from "../../../src/presentation/hooks/usePermisos";
import { usePlanMovil } from "../../../src/presentation/hooks/usePlanMovil";
import { supabase } from "@/src/data/services/supabaseClient";
import { globalStyles } from "../../../src/styles/globalStyles";

export default function PlanesGestion() {
  const { planes, cargando, error, buscarPlan, cargarPlanes, eliminarPlan } = usePlanMovil();
  const { puedeVerCatalogo, puedeCrear, puedeEliminar } = usePermisos();

  const [searchTerm, setSearchTerm] = useState("");
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");

  if (!puedeVerCatalogo) {
    return (
      <View style={globalStyles.containerCentered}>
        <Text>No tienes permisos para ver los planes.</Text>
      </View>
    );
  }

  const handleSearch = () => buscarPlan(searchTerm);

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

  return (
    <View style={globalStyles.container}>
      {/* HEADER */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>Planes Tigo</Text>
        <Text style={globalStyles.headerSubtitle}>Gestiona los planes del mercado</Text>
      </View>

      {/* SEARCH */}
      <View style={globalStyles.searchContainer}>
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Buscar plan..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={globalStyles.searchButton} onPress={handleSearch}>
          <Text style={globalStyles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* FORM CREAR PLAN */}
      {puedeCrear && (
        <View style={{ padding: 16 }}>
          <TextInput
            placeholder="Nombre del plan"
            value={nombre}
            onChangeText={setNombre}
            style={globalStyles.input}
          />
          <TextInput
            placeholder="Precio"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
            style={globalStyles.input}
          />
          <TextInput
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            style={globalStyles.input}
          />
          <TouchableOpacity style={[globalStyles.button, globalStyles.buttonPrimary]} onPress={handleCrear}>
            <Text style={globalStyles.buttonText}>Crear Plan</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={globalStyles.sectionTitle}>Planes Disponibles</Text>

      {cargando ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : error ? (
        <Text style={{ textAlign: "center", color: "red" }}>Error: {error}</Text>
      ) : (
        <FlatList
          data={planes}
          keyExtractor={(item) => item.planid}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              {/* CARD TOP */}
              <View style={globalStyles.cardTop} />

              <View style={globalStyles.cardContent}>
                {/* HEADER */}
                <View style={globalStyles.cardHeader}>
                  <Text style={globalStyles.cardName}>{item.nombre}</Text>
                  <Text style={globalStyles.cardPrice}>${item.precio}</Text>
                </View>

                {/* PROMO */}
                {item.promocion && (
                  <View style={globalStyles.cardPromo}>
                    <Text style={globalStyles.cardPromoText}>{item.promocion}</Text>
                  </View>
                )}

                {/* DESCRIPCION */}
                <Text style={globalStyles.cardDescription}>{item.descripcion}</Text>

                {/* DETALLES */}
                <View style={globalStyles.cardDetails}>
                  <Text style={globalStyles.cardDetail}>💻 {item.gigas} GB</Text>
                  <Text style={globalStyles.cardDetail}>📞 {item.minutos} min</Text>
                </View>

                {/* BOTONES */}
                <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                  <TouchableOpacity style={globalStyles.cardButton}>
                    <Text style={globalStyles.cardButtonText}>Ver Detalles</Text>
                  </TouchableOpacity>
                  {puedeEliminar && (
                    <TouchableOpacity
                      style={[globalStyles.cardButton, { backgroundColor: "#f44336" }]}
                      onPress={() => handleEliminar(item.planid)}
                    >
                      <Text style={globalStyles.cardButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
