import { useState } from "react";
import { Alert } from "react-native";
import { AuthUseCase, Role } from "@/src/domain/useCases/auth/AuthUseCase";
import { UsuarioRepositoryImpl } from "@/src/data/repositories/UsuarioRepositoryImpl";
import { Usuario } from "@/src/domain/models/Usuario";

const usuarioRepo = new UsuarioRepositoryImpl();
const authUseCase = new AuthUseCase(usuarioRepo);

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrar = async (nombre: string, email: string, password: string) => {
    try {
      setLoading(true);

      if (!nombre.trim()) throw new Error("El nombre es obligatorio");
      if (!email.includes("@")) throw new Error("Email inválido");
      if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");

      const role: Role = "Registrado";
      const nuevoUsuario = await authUseCase.registrar(nombre, email, password, role);

      setUsuario(nuevoUsuario);
      setError(null);

      Alert.alert(
        "Registro exitoso",
        `Usuario registrado: ${nuevoUsuario.nombre}\nConfirma tu correo antes de iniciar sesión.`
      );

      return nuevoUsuario;
    } catch (e: any) {
      if (e.status === 400 || e.message.includes("already registered")) {
        Alert.alert("Error", "El correo ya está registrado");
      } else {
        Alert.alert("Error", e.message || "Ocurrió un error inesperado");
      }
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      if (!email.includes("@")) throw new Error("Email inválido");
      if (!password) throw new Error("La contraseña es obligatoria");

      const loggedUser = await authUseCase.login(email, password);

      setUsuario(loggedUser);
      setError(null);

      return loggedUser;
    } catch (e: any) {
      setError(e.message);
      Alert.alert("Error", e.message || "Ocurrió un error inesperado");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    setError(null);
  };

  return { usuario, loading, error, registrar, login, logout };
};
