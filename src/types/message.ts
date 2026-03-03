import { initializedUserState, type User } from "./user";

interface Message {
  id: number;
  contenido: string;
  fecha: Date;
  grupoId: number;
  groupIdStr?: string;
  usuarioId: number;
  respuestaId?: number;
  senderName?: string;
  senderApodo?: string;

  usuario: User;
}

const initializedMessageState = {
  id: 0,
  contenido: "",
  fecha: new Date(),
  grupoId: 0,
  groupIdStr: undefined,
  usuarioId: 0,
  respuestaId: undefined,
  senderName: undefined,
  senderApodo: undefined,

  usuario: { ...initializedUserState },
};

export { initializedMessageState };

export type { Message };
