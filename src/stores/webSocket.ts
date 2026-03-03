import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import type { Message } from "@/types/message";
import useClusterStore from "./cluster";
import useMessageStore from "./message";
import useUserStore from "./user";
import { mapToStringEntityMessage } from "@/mappers/message";

const useWebSocketStore = defineStore("webSocket", () => {
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const messages = ref<Message[]>([]);
  const error = ref<string | null>(null);
  const url = ref(import.meta.env.VITE_URL_WS);
  const clusterStore = useClusterStore();
  const messageStore = useMessageStore();
  const userStore = useUserStore();
  const { cluster } = storeToRefs(clusterStore);
  const { user } = storeToRefs(userStore);

  // Actions
  const connect = () => {
    // Si ya hay una conexión, la cerramos primero
    if (ws.value) {
      ws.value.close();
    }

    ws.value = new WebSocket(url.value);

    ws.value.onopen = () => {
      isConnected.value = true;
      error.value = null;
      if (ws.value) {
        console.log("WebSocket: Conexión establecida");
        const token = localStorage.getItem("bearerToken");
        ws.value.send(JSON.stringify({ token: token }));
      }
    };

    ws.value.onmessage = (event) => {
      const messageData = event.data;
      try {
        // Attempt to parse the message as JSON
        const message = JSON.parse(messageData);
        const transformedMessage = mapToStringEntityMessage(message);
        // If we get here, it's a valid JSON object (a chat message)
        console.log("Mensaje de chat recibido:", message);

        messageStore.addAnswerToMessage(transformedMessage);
      } catch (error) {
        console.log("Mensaje de texto del servidor:", messageData);

        // Handle the text message (e.g., "authentication_successful")
        if (messageData === "authentication_successful") {
          console.log("Autenticación exitosa. Conectado al chat.");
          // You can update a state variable like isConnected to true here.
        }
      }
    };

    ws.value.onclose = () => {
      isConnected.value = false;
      console.log("WebSocket: Conexión cerrada");
    };

    ws.value.onerror = (event) => {
      error.value = "Error en la conexión WebSocket";
      console.error("WebSocket: Error:", event);
    };
  };

  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }
  };

  const sendMessage = (messageText: { [key: string]: any }) => {
    if (ws.value && isConnected.value) {
      const message = {
        id: String(messageText.id),
        senderId: String(messageText.usuarioId),
        groupId: cluster.value.clave,
        content: messageText.contenido,
        fecha: String(messageText.fecha),
        answerId: messageText.respuestaId
          ? String(messageText.respuestaId)
          : String(-1),
        senderName: user.value.nombre,
        senderApodo: user.value.apodo,
      };
      console.log("WebSocket: Enviando mensaje:", message);
      ws.value.send(JSON.stringify(message));
    } else {
      console.error(
        "No se puede enviar el mensaje: WebSocket no está conectado.",
      );
    }
  };

  // Getters (no se usan explícitamente en el setup, pero Pinia los expone)
  // `computed` properties son equivalentes
  const getIsConnected = () => isConnected.value;
  const getMessages = () => messages.value;
  const getError = () => error.value;

  return {
    ws,
    isConnected,
    messages,
    error,
    connect,
    disconnect,
    sendMessage,
    getIsConnected,
    getMessages,
    getError,
  };
});

export default useWebSocketStore;
