import { AuthUseCase } from "./AuthUseCase"; // Asegúrate de que estás importando AuthUseCase aquí
import { UsuarioRepositoryImpl } from "@/src/data/repositories/UsuarioRepositoryImpl"; // Ejemplo: instancia concreta

const usuarioRepository = new UsuarioRepositoryImpl();
const authUseCase = new AuthUseCase(usuarioRepository);

export const solicitarResetPassword = async (email: string) => {
  if (!email.includes("@")) throw new Error("Correo inválido.");

  return await authUseCase.solicitarReset(email);
};

export const confirmarResetPassword = async (token: string, nuevaPassword: string) => {
  if (nuevaPassword.length < 6) throw new Error("Contraseña muy corta.");

  return await authUseCase.confirmarReset(token, nuevaPassword);
};
