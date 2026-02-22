import type { User } from "@/types/user";

const mapToJsonEntityUser = (data: { [key: string]: any }): User => {
  return {
    id: data["id"] ?? 0,
    nombre: data["nombre"] ?? "",
    apodo: data["apodo"] ?? "",
    email: data["email"] ?? "",
    password: data["password"] ?? "",
    fecha: new Date(data["fecha"]) ?? new Date(),
    token: data.token,
    grupos: data.grupos,
    mensajes: data.mensajes,
  };
};

export { mapToJsonEntityUser };
