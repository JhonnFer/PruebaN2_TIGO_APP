import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { useRouter } from "expo-router";

// Obtener el ancho de la pantalla para el ancho de los botones
const screenWidth = Dimensions.get('window').width;

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Simulación de la barra de título superior */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Bienvenido a Tigo</Text>
        <Text style={styles.headerSubtitle}>Descubre nuestros planes móviles</Text>
      </View>
      
      {/* Contenedor principal para los botones */}
      <View style={styles.container}>
        {/* Botón Explorar como Invitado (Primario) */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => router.push("/(tabs)/Invitado")}
        >
          <Text style={styles.buttonPrimaryText}>Explorar como Invitado</Text>
        </TouchableOpacity>

        {/* Botón Iniciar Sesión (Secundario/Terciario 1) */}
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.buttonSecondaryText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        {/* Botón Registrarse (Secundario/Terciario 2) */}
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.push("/auth/registro")}
        >
          <Text style={styles.buttonSecondaryText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const TIGO_BLUE = "#0047B8"; // Azul oscuro principal de Tigo
const BUTTON_WIDTH = screenWidth * 0.9; // Ancho del 90% de la pantalla para los botones

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff', // Fondo blanco como en la imagen
  },
  headerContainer: {
    backgroundColor: TIGO_BLUE,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // Usamos esta área para simular la barra azul superior y el texto de bienvenida
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
  },
  container: { 
    flex: 1, 
    alignItems: "center", 
    paddingTop: 30, // Espacio entre el header y los botones
  },
  
  // --- Estilos del Botón Primario (Explorar como Invitado) ---
  buttonPrimary: {
    width: BUTTON_WIDTH,
    paddingVertical: 18, // Ligeramente más alto
    borderRadius: 8, // Bordes redondeados sutiles
    marginVertical: 10,
    alignItems: "center",
    backgroundColor: TIGO_BLUE, // Fondo azul oscuro
    // Sombra sutil para simular profundidad
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonPrimaryText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 18,
  },
  
  // --- Estilos de Botones Secundarios (Iniciar Sesión y Registrarse) ---
  buttonSecondary: {
    width: BUTTON_WIDTH,
    paddingVertical: 18,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    backgroundColor: '#fff', // Fondo blanco
    borderWidth: 1, // Borde para el contraste
    borderColor: '#ccc', // Borde gris claro (simula el diseño deseleccionado)
  },
  buttonSecondaryText: { 
    color: TIGO_BLUE, // Texto en color azul
    fontWeight: "600", 
    fontSize: 16, 
  },
});