// src/domain/useCases/auth/AuthUseCase.ts

import { Usuario } from "../../models/Usuario";
import { supabase } from "@/src/data/services/supabaseClient";
import { UsuarioRepository, Role } from "@/src/domain/repositories/UsuarioRepository";


export class AuthUseCase {
  constructor(private usuarioRepo: UsuarioRepository) {}

  private roleToId(role: Role) {
    switch (role) {
      case "Asesor": return 1;
      case "Registrado": return 2;
      case "Invitado": return 3;
      default: return 2;
    }
  }

  /** Registro de usuario usando Supabase Auth y tabla usuarios */
async registrar(nombre: string, email: string, password: string, telefono: string | undefined, role: Role) {
  const existe = await this.usuarioRepo.findByEmail(email);
  if (existe) throw new Error("El correo ya está registrado");

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) throw new Error("No se pudo crear el usuario en Supabase");

  const { data: userData, error: insertError } = await supabase
    .from("usuarios")
    .insert({
      usuarioid: userId,
      nombre,
      email,
      password,
      roleid: this.roleToId(role),
      telefono: telefono || null
    })
    .select()
    .single();

  if (insertError) throw insertError;

  return new Usuario(userId, nombre, email, password, role, telefono);
}
  /** Login de usuario */
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.user) throw new Error("Usuario no encontrado");

    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("usuarioid", data.user.id)
      .single();

    if (userError) throw userError;

    const roleMap: Record<number, Role> = {
      1: "Asesor",
      2: "Registrado",
      3: "Invitado",
    };
    const role = roleMap[userData.roleid] || "Registrado";

    return new Usuario(data.user.id, userData.nombre, userData.email, password, role);
  }
  /** Solicitar reset de contraseña usando Supabase Auth */
  async solicitarReset(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
    return data;
  }

  /** Confirmar reseteo de contraseña */
  async confirmarReset(token: string, newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
      access_token: token,
    });
    if (error) throw new Error(error.message);
    return data;
  }

}
