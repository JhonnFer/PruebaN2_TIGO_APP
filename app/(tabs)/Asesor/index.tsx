import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { usePermisos } from "../../../src/presentation/hooks/usePermisos";
import { usePlanMovil } from "../../../src/presentation/hooks/usePlanMovil";
import { supabase } from "@/src/data/services/supabaseClient";

// --- Colores y tamaños ---
const ASESOR_HEADER_GREEN = "#00A859";
const BUTTON_PRIMARY_BLUE = "#3498DB";
const BUTTON_EDIT_GREEN = "#1ABC9C";
const BUTTON_DELETE_RED = "#EF4444";
const CARD_PROMO_YELLOW = "#FFEB3B";
const BACKGROUND_LAVANDA = "#AFAEC8";
const screenWidth = Dimensions.get("window").width;

export default function PlanesGestion() {
  const { planes, cargando, error, cargarPlanes, eliminarPlan } = usePlanMovil();
  const { puedeVerCatalogo, puedeCrear, puedeEliminar } = usePermisos();

  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [gigas, setGigas] = useState("");
  const [minutos, setMinutos] = useState("");
  const [promocion, setPromocion] = useState("");
  const [imagenUri, setImagenUri] = useState<string | null>(null);

  useEffect(() => {
    cargarPlanes();
  }, []);

  if (!puedeVerCatalogo) {
    return (
      <View style={styles.containerCentered}>
        <Text>No tienes permisos para ver los planes.</Text>
      </View>
    );
  }

  const validarCampos = () => {
    if (!nombre || !precio || !descripcion || !gigas || !minutos) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios");
      return false;
    }
    if (isNaN(Number(precio)) || Number(precio) <= 0) {
      Alert.alert("Error", "El precio debe ser un número mayor a 0");
      return false;
    }
    if (isNaN(Number(gigas)) || Number(gigas) < 0) {
      Alert.alert("Error", "Los GB deben ser un número válido");
      return false;
    }
    if (isNaN(Number(minutos)) || Number(minutos) < 0) {
      Alert.alert("Error", "Los minutos deben ser un número válido");
      return false;
    }
    return true;
  };

  const subirImagen = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `${Date.now()}-${uri.split("/").pop()}`;
      const { error } = await supabase.storage
        .from("planes-imagenes")
        .upload(fileName, blob, { cacheControl: "3600", upsert: true });
      if (error) throw error;

      const { data } = supabase.storage.from("planes-imagenes").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (e: any) {
      Alert.alert("Error al subir imagen", e.message);
      return null;
    }
  };

  const handleGuardarPlan = async () => {
    if (!puedeCrear) return Alert.alert("Error", "No tienes permisos para crear/editar planes");
    if (!validarCampos()) return;

    try {
      let imagen_url = null;
      if (imagenUri) imagen_url = await subirImagen(imagenUri);

      if (editMode && selectedPlanId) {
        const { error } = await supabase
          .from("planes_moviles")
          .update({
            nombre,
            precio: parseFloat(precio),
            descripcion,
            gigas: parseInt(gigas),
            minutos: parseInt(minutos),
            promocion,
            imagen_url,
          })
          .eq("planid", selectedPlanId);
        if (error) throw error;
        Alert.alert("Éxito", "Plan actualizado");
      } else {
        const { error } = await supabase.from("planes_moviles").insert([
          {
            nombre,
            precio: parseFloat(precio),
            descripcion,
            gigas: parseInt(gigas),
            minutos: parseInt(minutos),
            promocion,
            imagen_url,
          },
        ]);
        if (error) throw error;
        Alert.alert("Éxito", "Plan creado");
      }

      // Limpiar formulario
      setNombre("");
      setPrecio("");
      setDescripcion("");
      setGigas("");
      setMinutos("");
      setPromocion("");
      setImagenUri(null);
      setEditMode(false);
      setSelectedPlanId(null);
      cargarPlanes();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const seleccionarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length > 0) {
        setImagenUri(result.assets[0].uri);
      }
    } catch (e: any) {
      Alert.alert("Error al seleccionar imagen", e.message);
    }
  };

  const handleEditar = (plan: any) => {
    setEditMode(true);
    setSelectedPlanId(plan.planid);
    setNombre(plan.nombre);
    setPrecio(plan.precio.toString());
    setDescripcion(plan.descripcion);
    setGigas(plan.gigas?.toString() || "");
    setMinutos(plan.minutos?.toString() || "");
    setPromocion(plan.promocion || "");
    setImagenUri(plan.imagen_url || null);
  };

  const handleEliminar = async (id: string) => {
    if (!puedeEliminar) return Alert.alert("Error", "No tienes permisos para eliminar");
    const result = await eliminarPlan(id);
    if (result.success) cargarPlanes();
    else Alert.alert("Error", result.error);
  };

  const FormularioPlan = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formLabel}>Nombre del Plan</Text>
      <TextInput
        placeholder="Ej: Plan Smart 10GB"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.formLabel}>Precio Mensual ($)</Text>
          <TextInput
            placeholder="19.99"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.formLabel}>Gigas de Datos</Text>
          <TextInput
            placeholder="10"
            value={gigas}
            onChangeText={setGigas}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>

      <Text style={styles.formLabel}>Minutos de Llamadas</Text>
      <TextInput
        placeholder="200"
        value={minutos}
        onChangeText={setMinutos}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.formLabel}>Descripción</Text>
      <TextInput
        placeholder="Describe las características del plan..."
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.formLabel}>Promoción (Opcional)</Text>
      <TextInput
        placeholder="Ej: ¡Primer mes gratis!"
        value={promocion}
        onChangeText={setPromocion}
        style={styles.input}
      />

      <Text style={styles.formLabel}>Imagen del Plan</Text>
      <TouchableOpacity style={styles.imagePlaceholder} onPress={seleccionarImagen}>
        {imagenUri ? (
          <Image source={{ uri: imagenUri }} style={styles.imagePreviewFull} />
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#999" }}>Toca para subir imagen</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.buttonPrimary, { marginTop: 20 }]} onPress={handleGuardarPlan} disabled={cargando}>
        <Text style={styles.buttonText}>{editMode ? "Actualizar Plan" : "Crear Plan"}</Text>
      </TouchableOpacity>

      {editMode && (
        <TouchableOpacity
          style={styles.buttonCancel}
          onPress={() => {
            setEditMode(false);
            setSelectedPlanId(null);
            setNombre("");
            setPrecio("");
            setDescripcion("");
            setGigas("");
            setMinutos("");
            setPromocion("");
            setImagenUri(null);
          }}
        >
          <Text style={styles.buttonCancelText}>Cancelar Edición</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={planes.filter((plan) => plan.nombre.toLowerCase().includes(searchTerm.toLowerCase()))}
      keyExtractor={(item) => item.planid}
      ListHeaderComponent={
        <>
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Gestión de Planes</Text>
            <Text style={styles.headerSubtitle}>Administra el catálogo de planes móviles</Text>
          </View>

          {puedeCrear && !editMode && (
            <TouchableOpacity
              style={[styles.buttonPrimary, { marginHorizontal: 20, marginTop: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }]}
              onPress={() => setEditMode(true)}
            >
              <Text style={[styles.buttonText, { marginRight: 10, fontSize: 18 }]}>+ Crear Nuevo Plan</Text>
            </TouchableOpacity>
          )}

          {editMode && FormularioPlan()}

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar plan..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity style={styles.searchButton} onPress={() => cargarPlanes()}>
              <Text style={styles.searchButtonText}>🔍</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Planes Activos</Text>
          {cargando && <ActivityIndicator size="large" style={{ marginTop: 50 }} />}
          {error && <Text style={{ textAlign: "center", color: "red" }}>Error: {error}</Text>}
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardImagePlaceholder} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{item.nombre}</Text>
              <Text style={styles.cardPrice}>${item.precio.toFixed(2)}</Text>
            </View>

            {item.promocion && (
              <View style={styles.cardPromo}>
                <Text style={styles.cardPromoText}>{item.promocion}</Text>
              </View>
            )}

            {item.imagen_url ? (
              <Image source={{ uri: item.imagen_url }} style={styles.cardImage} />
            ) : (
              <Text style={styles.cardDescription}>Perfecto para navegar y estar conectado</Text>
            )}

            <View style={styles.cardDetails}>
              <Text style={styles.cardDetail}>📱 {item.gigas} GB</Text>
              <Text style={styles.cardDetail}>📞 {item.minutos} min</Text>
            </View>

            <View style={styles.cardButtons}>
              <TouchableOpacity style={[styles.cardButton, { backgroundColor: BUTTON_EDIT_GREEN }]} onPress={() => handleEditar(item)}>
                <Text style={styles.cardButtonText}>✏️ Editar</Text>
              </TouchableOpacity>

              {puedeEliminar && (
                <TouchableOpacity style={[styles.cardButton, { backgroundColor: BUTTON_DELETE_RED }]} onPress={() => handleEliminar(item.planid)}>
                  <Text style={styles.cardButtonText}>🗑️ Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    />
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_LAVANDA, paddingTop: 10 },
  containerCentered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerCard: { padding: 20, backgroundColor: ASESOR_HEADER_GREEN, marginHorizontal: 20, marginBottom: 10, borderRadius: 10, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#fff" },
  searchContainer: { flexDirection: "row", paddingHorizontal: 20, alignItems: "center", marginBottom: 15, marginTop: 10 },
  searchInput: { flex: 1, backgroundColor: "#fff", padding: 12, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: "#E0E0E0" },
  searchButton: { backgroundColor: BUTTON_PRIMARY_BLUE, padding: 12, borderRadius: 8 },
  searchButtonText: { color: "#fff", fontSize: 16 },

  formContainer: { padding: 20, backgroundColor: "#fff", marginHorizontal: 20, marginTop: 15, marginBottom: 20, borderRadius: 10, elevation: 3 },
  formLabel: { fontSize: 16, fontWeight: "600", color: "#333", marginTop: 10, marginBottom: 5 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  column: { flex: 1 },
  textArea: { height: 100, textAlignVertical: "top", paddingTop: 10 },
  input: { backgroundColor: "#f9f9f9", padding: 12, borderRadius: 8, marginVertical: 4, borderWidth: 1, borderColor: "#E0E0E0" },

  buttonPrimary: { backgroundColor: BUTTON_PRIMARY_BLUE, padding: 15, borderRadius: 10, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  buttonCancel: { backgroundColor: "#9CA3AF", padding: 12, borderRadius: 8, marginTop: 10, alignItems: "center" },
  buttonCancelText: { color: "#fff", fontWeight: "bold" },

  imagePlaceholder: { borderWidth: 1, borderStyle: "dashed", borderColor: "#CCCCCC", borderRadius: 10, padding: 0, height: 150, marginTop: 5, marginBottom: 10, overflow: "hidden", justifyContent: "center", alignItems: "center" },
  imagePreviewFull: { width: "100%", height: "100%", borderRadius: 8 },

  sectionTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 20, marginVertical: 12, color: "#1F2937" },
  card: { backgroundColor: "#fff", marginHorizontal: 20, marginBottom: 20, borderRadius: 10, overflow: "hidden", elevation: 5 },
  cardImagePlaceholder: { height: screenWidth * 0.4, backgroundColor: BACKGROUND_LAVANDA },
  cardContent: { padding: 15 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6, alignItems: "baseline" },
  cardName: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  cardPrice: { fontSize: 22, fontWeight: "bold", color: BUTTON_PRIMARY_BLUE },
  cardPromo: { backgroundColor: CARD_PROMO_YELLOW, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4, alignSelf: "flex-start", marginVertical: 8, borderWidth: 1, borderColor: "#FFD700" },
  cardPromoText: { fontWeight: "bold", fontSize: 13, color: "#333" },
  cardImage: { width: "100%", height: 150, marginVertical: 8, borderRadius: 6 },
  cardDescription: { marginVertical: 8, color: "#6B7280" },
  cardDetails: { flexDirection: "row", gap: 15, marginVertical: 8 },
  cardDetail: { fontSize: 14, color: "#374151" },
  cardButtons: { flexDirection: "row", gap: 10, marginTop: 15 },
  cardButton: { padding: 10, borderRadius: 8, flex: 1, alignItems: "center" },
  cardButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
