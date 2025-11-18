//app/(tabs)/index.tsx
import { useAuth } from "@/src/presentation/hooks/useAuth";
import React from "react";
import { View } from "react-native";
import PlanesScreen from "../Roles/Asesor/PlanesCRUD";

export default function TabIndex() {
  const { usuario, loading } = useAuth();

  if (loading) return <View />; // o un spinner

  // Si no hay usuario, puedes redirigir al login
  if (!usuario) return <View />;

  // Pasamos el role a la pantalla de planes
  return <PlanesScreen role={usuario.role} />;
}
