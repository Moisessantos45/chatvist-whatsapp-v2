import type { Message } from "./message";

interface Cluster {
  id: number;
  clave: string;
  nombre: string;
  fecha: Date;
  createdById: number;

  messages:Message[]
}

const initializedClusterState = {
  id: 0,
  clave: "",
  nombre: "",
  fecha: new Date(),
  createdById: 0,
  messages: []
};

export { initializedClusterState };

export type { Cluster };
