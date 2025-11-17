import { supabase } from "@/src/data/services/supabaseClient";
import { Usuario } from "../../models/Usuario";

/**
 * AuthUseCase - Caso de Uso de Autenticación (versión gimnasio)
 *
 * Contiene toda la lógica de negocio relativa a:
 * - Registro
 * - Inicio de sesión
 * - Cierre de sesión
 * - Obtener sesión activa con perfil completo
 * - Escuchar cambios de autenticación
 *
 * Este UseCase es el encargado de hablar con Supabase y regresar objetos de negocio.
 */
export class AuthUseCase {
  /**
   * Registrar nuevo usuario
   *
   * @param email - Email del usuario
   * @param password - Contraseña
   * @param rol - Tipo de usuario: "entrenador" | "usuario"
   */
async registrar(email: string, password: string, rol: "entrenador" | "usuario") {
  try {
    console.log("🔁 Registrando usuario con rol:", rol);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    console.log("🆔 Usuario creado:", authData.user?.id);

    const { error: dbError } = await supabase
      .from("usuarios")
      .upsert(
        {
          id: authData.user?.id,
          email: authData.user?.email,
          rol,
        },
        { onConflict: "id" }
      );

    if (dbError) {
      console.error("🔥 Error al insertar en tabla usuarios:", dbError.message);
      throw dbError;
    } else {
      console.log("🟢 Perfil insertado correctamente en la tabla usuarios.");
    }

    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error("❌ Error en registrar:", error.message);
    return { success: false, error: error.message };
  }
}



  /**
   * Inicia sesión con email y contraseña
   */
  async iniciarSesion(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Cierra sesión de Supabase
   */
  async cerrarSesion() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Devuelve información del usuario actual + su perfil en la tabla usuarios
   */
  async obtenerUsuarioActual(): Promise<Usuario | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      // Buscar perfil completo en tabla usuarios
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); // 👉 evita error si no hay perfil

      if (error) throw error;

      if (!data) {
        console.warn(`⚠️ No hay perfil en 'usuarios' para el id: ${user.id}`);
        return null;
      }

      return data as Usuario;
    } catch (error) {
      console.log("Error al obtener usuario con perfil:", error);
      return null;
    }
  }

  /**
   * Escucha cambios en el estado de autenticación (login/logout)
   */
  onAuthStateChange(callback: (usuario: Usuario | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const usuario = await this.obtenerUsuarioActual();
        callback(usuario);
      } else {
        callback(null);
      }
    });
  }
}
