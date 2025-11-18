import { UsuarioRepositoryImpl } from "@/src/data/repositories/UsuarioRepositoryImpl";
import { supabase } from "@/src/data/services/supabaseClient";
import { Usuario } from "@/src/domain/models/Usuario";
import { Role } from "@/src/domain/repositories/UsuarioRepository";
import { AuthUseCase } from "@/src/domain/useCases/auth/AuthUseCase";
import {
  confirmarResetPassword,
  solicitarResetPassword,
} from "@/src/domain/useCases/auth/resetPasswordUseCase";
import { useEffect, useState } from "react";

const usuarioRepo = new UsuarioRepositoryImpl();
const authUseCase = new AuthUseCase(usuarioRepo);

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Persistencia de sesión y listener de cambios de auth
   */
  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const usuarioData = await usuarioRepo.findByIdWithPerfil(
            session.user.id
          );
          setUsuario(usuarioData);
        }
      } catch (err) {
        console.error("Error inicializando sesión:", err);
      } finally {
        setLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const usuarioData = await usuarioRepo.findByIdWithPerfil(
            session.user.id
          );
          setUsuario(usuarioData);
        } catch (err) {
          console.error("Error cargando usuario:", err);
        }
      } else {
        setUsuario(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Registro de nuevo usuario
   */
  const registrar = async (
    nombre: string,
    email: string,
    password: string,
    telefono?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones
      if (!nombre.trim()) throw new Error("El nombre es obligatorio");
      if (!email.includes("@")) throw new Error("Email inválido");
      if (password.length < 6)
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      if (telefono && telefono.length < 7)
        throw new Error("El teléfono es inválido");

      const role: Role = "Registrado";
      const nuevoUsuario = await authUseCase.registrar(
        nombre,
        email,
        password,
        telefono,
        role
      );

      setUsuario(nuevoUsuario);
      return nuevoUsuario;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login con email y contraseña
   */
  const login = async (email: string, password: string, rol?: Role) => {
    try {
      setLoading(true);
      setError(null);

      if (!email.includes("@")) throw new Error("Email inválido");
      if (!password) throw new Error("La contraseña es obligatoria");

      const loggedUser = await authUseCase.login(email, password);
      const usuarioConPerfil = await usuarioRepo.findByIdWithPerfil(
        loggedUser.usuarioid
      );

      if (!usuarioConPerfil) {
        throw new Error("No se pudo obtener el perfil del usuario");
      }

      setUsuario(usuarioConPerfil);
      return usuarioConPerfil;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login como invitado (sin autenticación)
   */
  const loginInvitado = () => {
    const invitado: Usuario = new Usuario(
      "guest-" + Date.now(),
      "Invitado",
      "invitado@tigo.com",
      "",
      "Invitado"
    );
    setUsuario(invitado);
    return invitado;
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUsuario(null);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Solicitar recuperación de contraseña
   */
  const recuperarPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "exp://localhost/auth/recuperar",
      });

      if (error) throw new Error(error.message);
      return "Correo de recuperación enviado";
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Solicitar reset de contraseña (alternativo)
   */
  const solicitarReset = async (email: string) => {
    return await solicitarResetPassword(email);
  };

  /**
   * Confirmar reset de contraseña
   */
  const confirmarReset = async (token: string, nuevaPass: string) => {
    return await confirmarResetPassword(token, nuevaPass);
  };

  return {
    usuario,
    loading,
    error,
    registrar,
    login,
    loginInvitado,
    logout,
    recuperarPassword,
    solicitarReset,
    confirmarReset,
  };
};
