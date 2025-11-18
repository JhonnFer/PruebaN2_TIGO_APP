import { UsuarioRepository, Role } from "@/src/domain/useCases/auth/AuthUseCase";
import { Usuario } from "@/src/domain/models/Usuario";
import { supabase } from "@/src/data/services/supabaseClient";

export class UsuarioRepositoryImpl implements UsuarioRepository {
  async findByEmail(email: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) return null;

    const roleMap: Record<number, Role> = { 1: "Asesor", 2: "Registrado", 3: "Invitado" };

    return new Usuario(
      data.usuarioid,
      data.nombre,
      data.email,
      data.password,
      roleMap[data.roleid] || "Registrado"
    );
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const { data, error } = await supabase
      .from("usuarios")
      .insert({
        usuarioid: usuario.usuarioid,
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.password,
        roleid: usuario.role === "Asesor" ? 1 : usuario.role === "Registrado" ? 2 : 3
      })
      .select()
      .single();

    if (error) throw error;

    return usuario;
  }

  async update(usuario: Usuario): Promise<Usuario> {
    const { data, error } = await supabase
      .from("usuarios")
      .update({
        nombre: usuario.nombre,
        password: usuario.password,
        roleid: usuario.role === "Asesor" ? 1 : usuario.role === "Registrado" ? 2 : 3
      })
      .eq("usuarioid", usuario.usuarioid)
      .select()
      .single();

    if (error) throw error;

    return usuario;
  }
  async findByIdWithPerfil(usuarioid: string): Promise<Usuario | null> {
  // Usando la view usuarios_con_rol
  const { data, error } = await supabase
    .from("usuarios_con_rol")
    .select("*")
    .eq("usuarioid", usuarioid)
    .single();

  if (error || !data) return null;

  // data.rol ya viene como 'Asesor', 'Registrado' o 'Invitado'
  return new Usuario(
    data.usuarioid,
    data.nombre,
    data.email,
    data.password,
    data.rol // usamos rol en texto para redirección
  );
}
}
