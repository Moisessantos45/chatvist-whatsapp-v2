import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import type { Message } from "@/types/message";
import { initializedMessageState } from "@/types/message";
import { mapToJsonEntityMessage } from "../mappers/message";
import useWebSocketStore from "./webSocket";
import useUserStore from "./user";
import useClusterStore from "./cluster";
import notification from "@/service/notification";

const useMessageStore = defineStore("message", () => {
  const api = import.meta.env.VITE_HOST_API;
  const userStore = useUserStore();
  const clusterStore = useClusterStore();
  const webSocketStore = useWebSocketStore();
  const { user } = storeToRefs(userStore);

  const message = ref<Message>({ ...initializedMessageState });
  const messages = ref<Message[]>([]);
  const currentCluster = ref<number>(-1);
  const isLoading = ref<boolean>(false);

  // Variables para respuestas
  const replyingToMessage = ref<number | null>(null);

  const getAllMessagesCluster = async (
    id: number = -1,
    startDate: string = "",
    endDate: string = "",
  ) => {
    try {
      isLoading.value = true;
      const { data } = await axios.get(
        `${api}/api/mensaje/group/${currentCluster.value}?fechaInicio=${startDate}&fechaFin=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
          },
        },
      );

      if (!data?.data) return;
      currentCluster.value = id;

      messages.value = data.data.map(mapToJsonEntityMessage);
    } catch (error) {
      notification("Error al obtener mensajes", "error");
    } finally {
      isLoading.value = false;
    }
  };

  const getAllMessagesClusterByClave = async (clave: string) => {
    try {
      const { data } = await axios.get(
        `${api}/api/mensaje/group/clave/${clave}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
          },
        },
      );

      if (!data?.data) return;
      console.log(data.data);
    } catch (error) {
      notification("Error al obtener mensajes", "error");
    }
  };

  const registerMessage = async () => {
    try {
      const { usuario, ...dataMessage } = message.value;
      const { data } = await axios.post(`${api}/api/mensaje`, dataMessage, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
        },
      });

      const newMessage = mapToJsonEntityMessage(data.data);
      newMessage.groupIdStr = clusterStore.cluster.clave;
      messages.value.push({ ...newMessage, usuario: user.value });
      webSocketStore.sendMessage(newMessage);
      message.value = { ...initializedMessageState };
    } catch (error) {
      notification("Error al enviar mensaje", "error");
    }
  };

  const addAnswerToMessage = (message: Message) => {
    if (
      !message.groupIdStr ||
      message.groupIdStr === clusterStore.cluster?.clave
    ) {
      if (!messages.value.some((m) => m.id === message.id)) {
        messages.value.push(message);
      }
    } else {
      // Here we could notify the ContactList that a new message arrived
      // For now we just ignore it so it doesn't pollute the current chat.
      console.log(
        "Message for another chat ignored by active view:",
        message.groupIdStr,
      );
    }
  };

  const exportarJSON = async (startDate: string = "", endDate: string = "") => {
    const inicio = startDate ? new Date(startDate).toISOString() : "";
    let fin;
    if (endDate && typeof fin === "object") {
      fin = new Date(endDate);
      fin.setHours(23, 59, 59, 999);
      fin = fin.toISOString();
    }

    await getAllMessagesCluster(currentCluster.value, inicio, fin);

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(messages.value, null, 2)),
    );
    element.setAttribute(
      "download",
      `grupo_${clusterStore.cluster.clave}.json`,
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Funciones para manejar respuestas
  const replyToMessage = (messageId: number) => {
    replyingToMessage.value = messageId;
  };

  const cancelReply = () => {
    replyingToMessage.value = null;
  };

  const getRepliedMessage = (respuestaId: number) => {
    return messages.value.find((msg) => msg.id === respuestaId);
  };

  const isReplyingToMessage = (messageId: number) => {
    return replyingToMessage.value === messageId;
  };

  // Función mejorada para enviar mensaje con respuesta
  const sendMessage = async (clusterId: number, clusterKey: string) => {
    if (!message.value.contenido.trim() || !clusterKey) return false;

    message.value.usuarioId = user.value.id;
    message.value.grupoId = clusterId;

    // Si estamos respondiendo a un mensaje, agregar el respuestaId
    if (replyingToMessage.value) {
      message.value.respuestaId = replyingToMessage.value;
    }

    await registerMessage();

    // Limpiar el estado de respuesta
    replyingToMessage.value = null;

    return true;
  };

  return {
    message,
    messages,
    currentCluster,
    replyingToMessage,
    getAllMessagesCluster,
    getAllMessagesClusterByClave,
    registerMessage,
    addAnswerToMessage,
    replyToMessage,
    cancelReply,
    getRepliedMessage,
    isReplyingToMessage,
    sendMessage,
    exportarJSON,
    isLoading,
  };
});

export default useMessageStore;
