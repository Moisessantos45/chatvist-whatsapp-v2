import type { Cluster } from "./cluster";
import type { Message } from "./message";

interface User {
  id: number;
  nombre: string;
  apodo: string;
  email: string;
  password: string;
  fecha: Date;
  token: string;

  grupos: Cluster[];
  mensajes: Message[];
}

const initializedUserState = {
  id: 0,
  nombre: "",
  apodo: "",
  email: "",
  password: "",
  fecha: new Date(),
  token: "",
  grupos: [],
  mensajes: [],
};

export { initializedUserState };

export type { User };
