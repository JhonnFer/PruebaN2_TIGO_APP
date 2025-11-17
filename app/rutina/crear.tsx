import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthUseCase } from "../../src/domain/useCases/auth/AuthUseCase";
import { Usuario } from "../../src/domain/models/Usuario";
import { supabase } from "../../src/data/services/supabaseClient";

const authUseCase = new AuthUseCase();

export default function CrearRutinaScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(false);

  // Cargar usuario actual al montar el componente
  useEffect(() => {
    const cargarUsuario = async () => {
      const u = await authUseCase.obtenerUsuarioActual();
      if (!u) {
        Alert.alert("Error", "No se pudo cargar tu perfil. Intenta iniciar sesión nuevamente.");
        router.replace("/auth/login");
      } else if (u.rol !== "entrenador") {
        Alert.alert("Acceso denegado", "Solo entrenadores pueden crear rutinas.");
        router.back();
      } else {
        setUsuario(u);
      }
    };

    cargarUsuario();
  }, []);

  const handleCrearRutina = async () => {
    if (!titulo || !descripcion) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (!usuario) {
      Alert.alert("Error", "Usuario no cargado");
      return;
    }

    setCargando(true);
    try {
      const { error } = await supabase
        .from("planes_entrenamiento")
        .insert({
          entrenador_id: usuario.id,
          titulo,
          descripcion,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      Alert.alert("Éxito", "Rutina creada correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);

      setTitulo("");
      setDescripcion("");
    } catch (err: any) {
      Alert.alert("Error al crear rutina", err.message);
    } finally {
      setCargando(false);
    }
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nueva Rutina</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Button
        title={cargando ? "Creando..." : "Crear Rutina"}
        onPress={handleCrearRutina}
        disabled={cargando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
