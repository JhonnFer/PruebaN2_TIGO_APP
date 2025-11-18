// src/presentation/hooks/usePermisos.ts
import { useAuth } from "./useAuth";

export function usePermisos() {
  const { usuario } = useAuth();

  const puedeVerCatalogo = usuario?.role === "Registrado" || usuario?.role === "Asesor" || usuario?.role === "Invitado";
  const puedeEliminar = usuario?.role === "Asesor";
  const puedeEditar = usuario?.role === "Asesor";
  const puedeCrear = usuario?.role === "Asesor";

  return { puedeVerCatalogo, puedeEliminar, puedeEditar, puedeCrear };
}
