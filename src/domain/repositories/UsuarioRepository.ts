//src\domain\repositories\UsuarioRepository.ts
import { Usuario } from "@/src/domain/models/Usuario";

export type Role = "Asesor" | "Registrado" | "Invitado";

export interface UsuarioRepository {
  findByEmail(email: string): Promise<Usuario | null>;
  create(usuario: Usuario): Promise<Usuario>;
  update(usuario: Usuario): Promise<Usuario>;
  findByIdWithPerfil(usuarioid: string): Promise<Usuario | null>;
}
