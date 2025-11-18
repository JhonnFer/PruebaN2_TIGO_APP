// app/(tabs)/index.tsx
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/presentation/hooks/useAuth";

export default function TabsEntry() {
  const { usuario } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (usuario?.role === "Asesor") router.replace("/(tabs)/Asesor");
    else if (usuario?.role === "Registrado") router.replace("/(tabs)/Registrado");
    else router.replace("/(tabs)/Invitado"); // por defecto
  }, [usuario]);

  return null; // no renderizamos nada, solo redirigimos
}
