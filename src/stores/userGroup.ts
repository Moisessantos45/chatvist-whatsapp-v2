import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import type { userGroup } from "@/types/userGroup";
import useUserStore from "./user";
import useClusterStore from "./cluster";
import notification from "@/service/notification";

const useUserGroupStore = defineStore("userGroup", () => {
  const api = import.meta.env.VITE_HOST_API;
  const { user } = storeToRefs(useUserStore());
  const clusterStore = useClusterStore();
  const userGroups = ref<userGroup[]>([]);
  const isMember = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

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
    try {
      await axios.post(
        `${api}/api/group-user/add`,
        {
          clave,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
          },
        },
      );

      await clusterStore.getAllClustersUser();
      notification("Usuario agregado al grupo con éxito.", "success");
    } catch (error) {
      notification(
        "Error al agregar usuario al grupo. Inténtalo de nuevo.",
        "error",
      );
    }
  };

  const verifyUserInGroup = async (clave: string) => {
    try {
      isLoading.value = true;
      const { data } = await axios.post(
        `${api}/api/group-user/verify-membership`,
        {
          clave,
          usuarioId: user.value.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
          },
        },
      );

      if (!data?.data) return;

      isMember.value = data.data;
    } catch (error) {
      isMember.value = false;
      notification("Error al verificar usuario en el grupo", "error");
    } finally {
      isLoading.value = false;
    }
  };

  return {
    userGroups,
    getAllGroupsUser,
    addUserToGroup,
    verifyUserInGroup,
    isMember,
    isLoading,
  };
});

export default useUserGroupStore;
