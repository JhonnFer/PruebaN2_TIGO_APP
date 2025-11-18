import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { AuthUseCase } from "@/src/domain/useCases/auth/AuthUseCase";
import { UsuarioRepositoryImpl } from "@/src/data/repositories/UsuarioRepositoryImpl";
import { Usuario } from "@/src/domain/models/Usuario";
import { supabase } from "@/src/data/services/supabaseClient";
import { solicitarResetPassword, confirmarResetPassword } from "@/src/domain/useCases/auth/resetPasswordUseCase";
import { Role } from "@/src/domain/repositories/UsuarioRepository";
const usuarioRepo = new UsuarioRepositoryImpl();
const authUseCase = new AuthUseCase(usuarioRepo);

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true); // true mientras verificamos sesión
  const [error, setError] = useState<string | null>(null);

  // ---------------------- Persistencia de sesión ----------------------
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const usuarioData = await usuarioRepo.findByIdWithPerfil(session.user.id);
        setUsuario(usuarioData);
      }
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const usuarioData = await usuarioRepo.findByIdWithPerfil(session.user.id);
        setUsuario(usuarioData);
      } else {
        setUsuario(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ---------------------- Registro ----------------------
  const registrar = async (nombre: string, email: string, password: string, telefono?: string) => {
    try {
      setLoading(true);

      if (!nombre.trim()) throw new Error("El nombre es obligatorio");
      if (!email.includes("@")) throw new Error("Email inválido");
      if (password.length < 6)
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      if (telefono && telefono.length < 10)
        throw new Error("El teléfono es inválido");

      const role: Role = "Registrado"; // Rol por defecto al registrarse
      const nuevoUsuario = await authUseCase.registrar(nombre, email, password, telefono, role);

      setUsuario(nuevoUsuario);
      setError(null);

      Alert.alert(
        "Registro exitoso",
        `Usuario registrado: ${nuevoUsuario.nombre}\nConfirma tu correo antes de iniciar sesión.`
      );

      return nuevoUsuario;
    } catch (e: any) {
      setError(e.message);
      Alert.alert("Error", e.message || "Ocurrió un error inesperado");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- Login ----------------------
  const login = async (email: string, password: string, router: any) => {
    try {
      setLoading(true);

      if (!email.includes("@")) throw new Error("Email inválido");
      if (!password) throw new Error("La contraseña es obligatoria");

      // Login usando tu UseCase
      const loggedUser = await authUseCase.login(email, password);

      // Obtener usuario con perfil/role desde repositorio
      const usuarioConPerfil = await usuarioRepo.findByIdWithPerfil(loggedUser.usuarioid);
      if (!usuarioConPerfil) throw new Error("No se pudo obtener el perfil del usuario");

      setUsuario(usuarioConPerfil);
      setError(null);

      // Redirigir según role
      switch (usuarioConPerfil.role) {
        case "Asesor":
          router.replace("/Perfiles/asesor");
          break;
        case "Registrado":
          router.replace("/Perfiles/usuario");
          break;
        default:
          router.replace("/explore");
      }

      return usuarioConPerfil;
    } catch (e: any) {
      setError(e.message);
      Alert.alert("Error iniciado sesión", e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- Login Invitado ----------------------
  const loginInvitado = () => {
    const invitado: Usuario = new Usuario(
      "00000000-0000-0000-0000-000000000000",
      "Invitado",
      "invitado@tigo.com",
      "",
      "Invitado"
    );
    setUsuario(invitado);
    return invitado;
  };

  // ---------------------- Logout ----------------------
  const logout = async (router?: any) => {
    await supabase.auth.signOut();
    setUsuario(null);
    setError(null);
    if (router) router.replace("/auth/login");
  };
const recuperarPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "exp://127.0.0.1:19000/auth/password-update", // URL hacia tu app, ajusta si es necesario
    });

    if (error) {
      throw new Error(error.message);
    }

    return "Correo de recuperación enviado";
  } catch (e) {
    throw e;
  }
};
const solicitarReset = async (email: string) => {
    return await solicitarResetPassword(email);
  };

  const confirmarReset = async (token: string, nuevaPass: string) => {
    return await confirmarResetPassword(token, nuevaPass);
  };
  return { usuario, loading, error, registrar, login, loginInvitado, logout, recuperarPassword, solicitarReset, confirmarReset };
};
