export class Usuario {
  constructor(
    public usuarioid: string,
    public nombre: string,
    public email: string,
    public password: string,
    public role: "Asesor" | "Registrado" | "Invitado"
  ) {}
}
