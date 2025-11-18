// app/Planes/_layout.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/presentation/hooks/useAuth";

export default function PlanesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { usuario, loading } = useAuth();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!usuario) {
        // No está logueado → ir a login
        router.replace("/auth/login");
      } else if (usuario.role === "Asesor") {
        // Asesor → mostrar CRUD
        router.replace("/Planes/PlanesCRUD");
      } else if (usuario.role === "Registrado") {
        // Registrado → mostrar solo catálogo
        router.replace("/Planes/CatalogoPlanes");
      } else {
        // Otros roles → opcional: mostrar catálogo
        router.replace("/Planes/CatalogoPlanes");
      }
    }
  }, [usuario, loading]);

  if (loading || !usuario) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0047AB" />
      </View>
    );
  }

  return <>{children}</>;
}
