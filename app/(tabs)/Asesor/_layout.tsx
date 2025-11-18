import { Tabs } from "expo-router";
import React from "react";
// Importar la librería de iconos
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"; 
import { Platform } from "react-native"; // Necesario para ajustes de plataforma

// Definición de colores (Estilo Asesor)
// Basado en la imagen: fondo lavanda suave, activo morado oscuro
const TABS_ACTIVE_COLOR = "#6A1B9A"; // Morado oscuro para el ícono/texto activo
const TABS_BACKGROUND_COLOR = "#F2F0F5"; // Fondo lavanda/morado muy suave
const TABS_INACTIVE_COLOR = "#A0A0A0"; // Gris suave para iconos inactivos

export default function AsesorTabsLayout() {
  
  // Ajuste de padding inferior para asegurar que los tabs suban
  const TAB_BAR_HEIGHT = 65;
  const BOTTOM_PADDING_ADJUSTMENT = Platform.OS === 'ios' ? 15 : 5;
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: TABS_BACKGROUND_COLOR, 
          // Sombra sutil para levantar la barra de tabs
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 5,
          height: TAB_BAR_HEIGHT + BOTTOM_PADDING_ADJUSTMENT,
          paddingBottom: BOTTOM_PADDING_ADJUSTMENT, 
        },
        tabBarActiveTintColor: TABS_ACTIVE_COLOR,
        tabBarInactiveTintColor: TABS_INACTIVE_COLOR,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5, 
        }
      }}
    >
      {/* 1. Planes (Index) */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Planes",
          tabBarIcon: ({ color }) => (
            // Icono de Caja (Planes)
            <Ionicons name="cube-outline" size={26} color={color} />
          ),
        }} 
      />
      
      {/* 2. Solicitudes */}
      <Tabs.Screen 
        name="Solicitudes" 
        options={{ 
          title: "Solicitudes",
          tabBarIcon: ({ color }) => (
            // Icono de Carrito (Solicitudes)
            <FontAwesome5 name="shopping-cart" size={24} color={color} />
          ),
        }} 
      />
      
      {/* 3. Chats */}
      <Tabs.Screen 
        name="chat" 
        options={{ 
          title: "Chats",
          tabBarIcon: ({ color }) => (
            // Icono de Burbuja de Diálogo/Chat
            <Ionicons name="chatbubble-ellipses-outline" size={26} color={color} />
          ),
        }}
      />
      
      {/* 4. Perfil */}
      <Tabs.Screen 
        name="perfil" 
        options={{ 
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            // Icono de Persona/Usuario
            <FontAwesome5 name="user-alt" size={24} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}