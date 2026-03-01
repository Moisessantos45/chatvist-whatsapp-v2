import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import type { Message } from "@/types/message";
import { initializedMessageState } from "@/types/message";
import { mapToJsonEntityMessage } from "../mappers/message";
import useWebSocketStore from "./webSocket";
import useUserStore from "./user";

const useMessageStore = defineStore("message", () => {
  const api = import.meta.env.VITE_HOST_API;
  const message = ref<Message>({ ...initializedMessageState });
  const messages = ref<Message[]>([]);
  const webSocketStore = useWebSocketStore();
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  // Variables para respuestas
  const replyingToMessage = ref<number | null>(null);

  const getAllMessagesCluster = async (id: number) => {
    try {
      const { data } = await axios.get(`${api}/api/mensaje/group/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
        },
      });

      console.log("Get all messages success:", data);
      if (!data?.data) return;

      messages.value = data.data.map(mapToJsonEntityMessage);
      console.log("Messages:", messages.value);
    } catch (error) {
      console.log("Get all messages error:", error);
    }
  };

  const registerMessage = async () => {
    try {
      console.log("Registering message:", message.value);
      const { usuario, ...dataMessage } = message.value;
      const { data } = await axios.post(`${api}/api/mensaje`, dataMessage, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bearerToken")}`,
        },
      });

      const newMessage = mapToJsonEntityMessage(data.data);
      messages.value.push({ ...newMessage, usuario: user.value });
      webSocketStore.sendMessage(newMessage);
      message.value = { ...initializedMessageState };
    } catch (error) {
      console.log("Register message error:", error);
    }
  };

  const addAnswerToMessage = (message: Message) => {
    console.log("Adding answer to message:", message);
    if (message.respuestaId !== user.value.id) {
      messages.value = [
        ...messages.value.filter((m) => m.id !== message.id),
        message,
      ];
    }
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
    replyingToMessage,
    getAllMessagesCluster,
    registerMessage,
    addAnswerToMessage,
    replyToMessage,
    cancelReply,
    getRepliedMessage,
    isReplyingToMessage,
    sendMessage,
  };
});

export default useMessageStore;
