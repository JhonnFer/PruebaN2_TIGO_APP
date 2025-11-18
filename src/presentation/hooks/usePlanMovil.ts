import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/data/services/supabaseClient";

export function usePlanMovil() {
  const [planes, setPlanes] = useState<any[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarPlanes = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const { data, error } = await supabase.from("planes").select("*");

      if (error) {
        throw new Error(error.message);
      }

      setPlanes(data || []);
    } catch (err: any) {
      setError(err.message);
      setPlanes([]);
    } finally {
      setCargando(false);
    }
  }, []);

  const buscarPlan = async (termino: string) => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("planes")
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
  };

  const eliminarPlan = async (planId: string) => {
    try {
      const { error } = await supabase.from("planes").delete().eq("id", planId);
      if (error) throw new Error(error.message);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    cargarPlanes(); // Cargar planes al montar el hook
  }, [cargarPlanes]);

  return {
    planes,
    cargando,
    error,
    cargarPlanes,
    buscarPlan,
    eliminarPlan,
  };
}
