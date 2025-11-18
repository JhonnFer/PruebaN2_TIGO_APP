// src/presentation/hooks/usePlanMovil.ts
import { supabase } from "@/src/data/services/supabaseClient";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { usePermisos } from "./usePermisos";

export function usePlanMovil() {
  const { usuario } = useAuth();
  const { puedeVerCatalogo, puedeEliminar, puedeCrear, puedeEditar } =
    usePermisos();

  const [planes, setPlanes] = useState<any[]>([]);
  const [planesContratados, setPlanesContratados] = useState<any[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [subidoImagenes, setSubidoImagenes] = useState<number>(0);
  const unsubscribeRef = useRef<any>(null);

  /**
   * Cargar todos los planes según rol y suscribirse a cambios en tiempo real
   */
  const cargarPlanes = useCallback(async () => {
    if (!puedeVerCatalogo || !usuario) return;

    try {
      setCargando(true);
      setError(null);

      let query = supabase.from("planes_moviles").select("*");

      // Solo planes activos para usuarios registrados o invitados
      if (usuario.role === "Registrado" || usuario.role === "Invitado") {
        query = query.eq("activo", true);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      setPlanes(data || []);

      // Suscribirse a cambios en tiempo real (solo si el usuario es asesor)
      if (usuario.role === "Asesor") {
        unsubscribeRef.current = supabase
          .channel("planes_moviles")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "planes_moviles",
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setPlanes((prev) => [...prev, payload.new]);
              } else if (payload.eventType === "UPDATE") {
                setPlanes((prev) =>
                  prev.map((p) => (p.id === payload.new.id ? payload.new : p))
                );
              } else if (payload.eventType === "DELETE") {
                setPlanes((prev) =>
                  prev.filter((p) => p.id !== payload.old.id)
                );
              }
            }
          )
          .subscribe();
      }
    } catch (err: any) {
      setError(err.message);
      setPlanes([]);
    } finally {
      setCargando(false);
    }
  }, [puedeVerCatalogo, usuario]);

  /**
   * Buscar plan por nombre
   */
  const buscarPlan = useCallback(
    async (termino: string) => {
      if (!puedeVerCatalogo || !usuario) return;

      try {
        setCargando(true);

        let query = supabase
          .from("planes_moviles")
          .select("*")
          .ilike("nombre", `%${termino}%`);

        if (usuario.role === "Registrado" || usuario.role === "Invitado") {
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
    },
    [puedeVerCatalogo, usuario]
  );

  /**
   * Obtener plan por ID
   */
  const obtenerPlanPorId = (planid: string) => {
    return planes.find((p) => p.id === planid || p.planid === planid) || null;
  };

  /**
   * Contratar plan (crear contratación)
   */
  const contratarPlan = async (planid: string) => {
    if (!usuario || usuario.role !== "Registrado")
      throw new Error("No autorizado");

    try {
      const { data, error } = await supabase
        .from("contrataciones")
        .insert([
          {
            plan_id: planid,
            usuario_id: usuario.usuarioid,
            estado: "PENDIENTE",
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw new Error(error.message);

      // Actualizar estado local
      const planContratado = planes.find(
        (p) => p.id === planid || p.planid === planid
      );
      if (planContratado) {
        setPlanesContratados((prev) => [
          ...prev,
          {
            ...planContratado,
            estado: "PENDIENTE",
            fecha: new Date().toISOString(),
          },
        ]);
      }

      return data?.[0];
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  /**
   * Cargar planes contratados del usuario
   */
  const cargarPlanesContratados = useCallback(async () => {
    if (!usuario || usuario.role !== "Registrado") return;

    try {
      const { data, error } = await supabase
        .from("contrataciones")
        .select("*, planes_moviles(*)")
        .eq("usuario_id", usuario.usuarioid);

      if (error) throw new Error(error.message);

      const contratados = (data || []).map((c: any) => ({
        id: c.id,
        plan_id: c.plan_id,
        nombre: c.planes_moviles?.nombre,
        descripcion: c.planes_moviles?.descripcion,
        gigas: c.planes_moviles?.gigas,
        minutos: c.planes_moviles?.minutos,
        promocion: c.planes_moviles?.promocion,
        precio: c.planes_moviles?.precio,
        imagen_url: c.planes_moviles?.imagen_url,
        estado: c.estado,
        created_at: c.created_at,
      }));

      setPlanesContratados(contratados);
    } catch (err: any) {
      console.error("Error cargando planes contratados:", err.message);
      setPlanesContratados([]);
    }
  }, [usuario]);

  /**
   * Crear nuevo plan (solo asesores)
   */
  const crearPlan = async (planData: {
    nombre: string;
    descripcion: string;
    gigas: number;
    minutos: number;
    precio: number;
    promocion?: string;
    imagen?: any; // File object
  }) => {
    if (!puedeCrear) throw new Error("No tienes permisos para crear planes");

    try {
      setCargando(true);

      // Si hay imagen, subirla primero
      let imagenUrl = null;
      if (planData.imagen) {
        imagenUrl = await subirImagenPlan(planData.imagen);
      }

      const { data, error } = await supabase
        .from("planes_moviles")
        .insert([
          {
            nombre: planData.nombre,
            descripcion: planData.descripcion,
            gigas: planData.gigas,
            minutos: planData.minutos,
            precio: planData.precio,
            promocion: planData.promocion || null,
            imagen_url: imagenUrl,
            creado_por_asesor_id: usuario?.usuarioid,
            activo: true,
          },
        ])
        .select();

      if (error) throw new Error(error.message);

      const nuevoPlan = data?.[0];
      setPlanes((prev) => [...prev, nuevoPlan]);

      return nuevoPlan;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  /**
   * Actualizar plan (solo asesores)
   */
  const actualizarPlan = async (
    planid: string,
    planData: {
      nombre?: string;
      descripcion?: string;
      gigas?: number;
      minutos?: number;
      precio?: number;
      promocion?: string;
      imagen?: any; // File object
    }
  ) => {
    if (!puedeEditar) throw new Error("No tienes permisos para editar planes");

    try {
      setCargando(true);

      // Si hay nueva imagen, subirla y eliminar la anterior
      let imagenUrl = undefined;
      if (planData.imagen) {
        const planActual = obtenerPlanPorId(planid);
        if (planActual?.imagen_url) {
          await eliminarImagenPlan(planActual.imagen_url);
        }
        imagenUrl = await subirImagenPlan(planData.imagen);
      }

      const datosActualizar: any = {
        ...planData,
        imagen: undefined, // No incluir el objeto File
      };

      if (imagenUrl !== undefined) {
        datosActualizar.imagen_url = imagenUrl;
      }

      const { data, error } = await supabase
        .from("planes_moviles")
        .update(datosActualizar)
        .eq("id", planid)
        .select();

      if (error) throw new Error(error.message);

      const planActualizado = data?.[0];
      setPlanes((prev) =>
        prev.map((p) => (p.id === planid ? planActualizado : p))
      );

      return planActualizado;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  /**
   * Subir imagen a Storage
   */
  const subirImagenPlan = async (archivo: any): Promise<string> => {
    if (!archivo) throw new Error("No hay archivo para subir");

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (archivo.size > maxSize) {
      throw new Error("La imagen debe ser menor a 5MB");
    }

    // Validar tipo por extensión (más confiable que MIME type)
    const nombre = archivo.name || archivo.uri || "";
    const extension = nombre.toLowerCase().split(".").pop();
    const extensionesValidas = ["jpg", "jpeg", "png"];

    if (!extensionesValidas.includes(extension)) {
      throw new Error("Solo se permiten imágenes JPG y PNG");
    }

    try {
      const nombreArchivo = `${Date.now()}_${
        archivo.name || `imagen_${Date.now()}`
      }`;
      const ruta = `planes/${nombreArchivo}`;

      const { error } = await supabase.storage
        .from("planes-imagenes")
        .upload(ruta, archivo, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw new Error(error.message);

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from("planes-imagenes")
        .getPublicUrl(ruta);

      setSubidoImagenes((prev) => prev + 1);
      return urlData.publicUrl;
    } catch (err: any) {
      throw new Error(`Error subiendo imagen: ${err.message}`);
    }
  };

  /**
   * Eliminar imagen de Storage
   */
  const eliminarImagenPlan = async (urlImagen: string): Promise<void> => {
    try {
      // Extraer ruta de la URL
      const partes = urlImagen.split(
        "/storage/v1/object/public/planes-imagenes/"
      );
      if (partes.length < 2) return;

      const ruta = partes[1];

      const { error } = await supabase.storage
        .from("planes-imagenes")
        .remove([ruta]);

      if (error) console.warn("Error eliminando imagen:", error.message);
    } catch (err: any) {
      console.warn("Error al eliminar imagen:", err.message);
    }
  };

  /**
   * Eliminar plan (solo asesores)
   */
  const eliminarPlan = async (planid: string) => {
    if (!puedeEliminar) return { success: false, error: "No tienes permisos" };

    try {
      // Primero eliminar la imagen si existe
      const plan = obtenerPlanPorId(planid);
      if (plan?.imagen_url) {
        await eliminarImagenPlan(plan.imagen_url);
      }

      // Luego eliminar el plan
      const { error } = await supabase
        .from("planes_moviles")
        .delete()
        .eq("id", planid);

      if (error) throw new Error(error.message);

      setPlanes((prev) => prev.filter((p) => p.id !== planid));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    cargarPlanes();
    cargarPlanesContratados();

    // Cleanup
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [cargarPlanes, cargarPlanesContratados]);

  return {
    planes,
    planesContratados,
    cargando,
    error,
    subidoImagenes,
    cargarPlanes,
    buscarPlan,
    obtenerPlanPorId,
    contratarPlan,
    crearPlan,
    actualizarPlan,
    eliminarPlan,
    subirImagenPlan,
    eliminarImagenPlan,
    cargarPlanesContratados,
  };
}
