// src/presentation/hooks/usePlanMovil.ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/data/services/supabaseClient";
import { usePermisos } from "./usePermisos";
import { useAuth } from "./useAuth";

export function usePlanMovil() {
  const { usuario } = useAuth();
  const { puedeVerCatalogo, puedeEliminar } = usePermisos();

  const [planes, setPlanes] = useState<any[]>([]);
  const [planesContratados, setPlanesContratados] = useState<any[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Cargar todos los planes según rol ---
  const cargarPlanes = useCallback(async () => {
    if (!puedeVerCatalogo) return;

    try {
      setCargando(true);
      setError(null);

      let query = supabase.from("planes_moviles").select("*");

      // Filtro según rol
      if (usuario?.role === "usuario_registrado" || usuario?.role === "invitado") {
        query = query.eq("activo", true); // solo planes activos
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      setPlanes(data || []);
    } catch (err: any) {
      setError(err.message);
      setPlanes([]);
    } finally {
      setCargando(false);
    }
  }, [puedeVerCatalogo, usuario]);

  // --- Buscar plan por nombre ---
  const buscarPlan = useCallback(async (termino: string) => {
    if (!puedeVerCatalogo) return;

    try {
      setCargando(true);

      let query = supabase
        .from("planes_moviles")
        .select("*")
        .ilike("nombre", `%${termino}%`);

      if (usuario?.role === "usuario_registrado" || usuario?.role === "invitado") {
        query = query.eq("activo", true);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      setPlanes(data || []);
    } catch (err: any) {
      setError(err.message);
      setPlanes([]);
    } finally {
      setCargando(false);
    }
  }, [puedeVerCatalogo, usuario]);

  // --- Obtener plan por ID ---
  const obtenerPlanPorId = (planid: string) => {
    return planes.find(p => p.planid === planid) || null;
  };

  // --- Contratar plan (solo usuario registrado) ---
  const contratarPlan = async (planid: string) => {
    if (usuario?.role !== "usuario_registrado") throw new Error("No autorizado");

    try {
      const { data, error } = await supabase
        .from("contrataciones")
        .insert([{ planid, userid: usuario.id, estado: "PENDIENTE", fecha: new Date().toISOString() }]);

      if (error) throw new Error(error.message);

      // Actualizar estado local
      const planContratado = planes.find(p => p.planid === planid);
      if (planContratado) {
        setPlanesContratados(prev => [
          ...prev,
          { ...planContratado, estado: "PENDIENTE", fecha: new Date().toISOString() }
        ]);
      }

      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  // --- Cargar planes contratados del usuario ---
  const cargarPlanesContratados = useCallback(async () => {
    if (!usuario || usuario.role !== "usuario_registrado") return;

    try {
      const { data, error } = await supabase
        .from("contrataciones")
        .select("*, planes_moviles(*)")
        .eq("userid", usuario.id);

      if (error) throw new Error(error.message);

      // Mapeo para tener datos planos
      const contratados = (data || []).map((c: any) => ({
        planid: c.planid,
        nombre: c.planes_moviles.nombre,
        descripcion: c.planes_moviles.descripcion,
        gigas: c.planes_moviles.gigas,
        minutos: c.planes_moviles.minutos,
        precio: c.planes_moviles.precio,
        estado: c.estado,
        fecha: c.fecha,
      }));

      setPlanesContratados(contratados);
    } catch (err: any) {
      console.log(err.message);
      setPlanesContratados([]);
    }
  }, [usuario]);

  useEffect(() => {
    cargarPlanes();
    cargarPlanesContratados();
  }, [cargarPlanes, cargarPlanesContratados]);

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

  return {
    planes,
    planesContratados,
    cargando,
    error,
    cargarPlanes,
    buscarPlan,
    obtenerPlanPorId,
    contratarPlan,
    eliminarPlan,
  };
}
