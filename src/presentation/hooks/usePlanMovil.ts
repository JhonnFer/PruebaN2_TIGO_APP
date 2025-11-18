// src/presentation/hooks/usePlanMovil.ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/data/services/supabaseClient";
import { usePermisos } from "./usePermisos";

export function usePlanMovil() {
  const { puedeVerCatalogo, puedeEliminar } = usePermisos();
  const [planes, setPlanes] = useState<any[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarPlanes = useCallback(async () => {
    if (!puedeVerCatalogo) return;
    try {
      setCargando(true);
      setError(null);
      const { data, error } = await supabase.from("planes_moviles").select("*");
      if (error) throw new Error(error.message);
      setPlanes(data || []);
    } catch (err: any) {
      setError(err.message);
      setPlanes([]);
    } finally {
      setCargando(false);
    }
  }, [puedeVerCatalogo]);

  const buscarPlan = useCallback(async (termino: string) => {
    if (!puedeVerCatalogo) return;
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("planes_moviles")
        .select("*")
        .ilike("nombre", `%${termino}%`);
      if (error) throw new Error(error.message);
      setPlanes(data || []);
    } catch (err: any) {
      setError(err.message);
      setPlanes([]);
    } finally {
      setCargando(false);
    }
  }, [puedeVerCatalogo]);

  const eliminarPlan = async (planId: string) => {
    if (!puedeEliminar) return { success: false, error: "No tienes permisos" };
    try {
      const { error } = await supabase.from("planes_moviles").delete().eq("planid", planId);
      if (error) throw new Error(error.message);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    cargarPlanes();
  }, [cargarPlanes]);

  return {
    planes,
    cargando,
    error,
    cargarPlanes,
    buscarPlan, // <---- ¡agregado!
    eliminarPlan,
  };
}
