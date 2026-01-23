import { initializedUserState, type User } from "./user";

interface Message {
  id: number;
  contenido: string;
  fecha: Date;
  grupoId: number;
  usuarioId: number;
  respuestaId?: number;

  usuario: User;
}

const initializedMessageState = {
  id: 0,
  contenido: "",
  fecha: new Date(),
  grupoId: 0,
  usuarioId: 0,
  respuestaId: undefined,

  usuario: { ...initializedUserState },
};

export { initializedMessageState };

export type { Message };
