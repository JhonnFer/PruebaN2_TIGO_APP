// app/Planes/CatalogoPlanes.tsx
import React, { useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { usePermisos } from "../../../src/presentation/hooks/usePermisos";
import { usePlanMovil } from "../../../src/presentation/hooks/usePlanMovil";
import { globalStyles } from "../../../src/styles/globalStyles";

export default function CatalogoPlanes() {
  const { planes, cargando, error, buscarPlan } = usePlanMovil();
  const { puedeVerCatalogo } = usePermisos();
  const [searchTerm, setSearchTerm] = useState("");

  if (!puedeVerCatalogo) {
    return (
      <View style={globalStyles.containerCentered}>
        <Text>No tienes permisos para ver los planes.</Text>
      </View>
    );
  }

  const handleSearch = () => {
    buscarPlan(searchTerm);
  };

  return (
    <View style={globalStyles.container}>
      {/* HEADER */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>Nuevos Planes Tigo</Text>
        <Text style={globalStyles.headerSubtitle}>Los mejores planes del mercado</Text>
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

      {/* SECTION TITLE */}
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

                {/* BOTON */}
                <TouchableOpacity style={globalStyles.cardButton}>
                  <Text style={globalStyles.cardButtonText}>Ver Detalles</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
