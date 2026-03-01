import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import type { userGroup } from "@/types/userGroup";
import useUserStore from "./user";
import useClusterStore from "./cluster";
import notification from "@/service/notification";

const useUserGroupStore = defineStore("userGroup", () => {
  const api = import.meta.env.VITE_HOST_API;
  const userGroups = ref<userGroup[]>([]);
  const { user } = storeToRefs(useUserStore());
  const clusterStore = useClusterStore();

  const getAllGroupsUser = async () => {
    try {
      const response = await axios.get(`${api}/api/group-user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
        },
      });

      userGroups.value = response.data;
    } catch (error) {
      console.error("Error fetching user groups:", error);
    }
  };

  const addUserToGroup = async (clave: string) => {
    if (!user.value) return;

    try {
      await axios.post(
        `${api}/api/group-user/add`,
        {
          clave,
          usuarioId: user.value.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
          },
        }
      );

      await clusterStore.getAllClustersUser();
      notification("Usuario agregado al grupo con éxito.", "success");
    } catch (error) {
      console.log("Error al agregar usuario al grupo:", error);
      notification(
        "Error al agregar usuario al grupo. Inténtalo de nuevo.",
        "error"
      );
    }
  };

  return {
    userGroups,
    getAllGroupsUser,
    addUserToGroup,
  };
});

export default useUserGroupStore;
