import type { userGroup } from "@/types/userGroup";

const mapToJsonEntityUserGroup = (data: { [key: string]: any }): userGroup => {
  return {
    grupoId: data["grupoId"] ?? -1,
    usuarioId: data["usuarioId"] ?? -1,
  };
};

export { mapToJsonEntityUserGroup };
