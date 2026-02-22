import type { Contact } from "@/types/chat";

// Mock data
const contacts: Contact[] = [
  {
    id: 1,
    name: "Ana García",
    lastMessage: "¡Hola! ¿Cómo estás?",
    lastMessageTime: "12:30",
    unreadCount: 2,
    online: true,
    lastSeen: "hace 5 min",
    messages: [
      {
        id: 1,
        text: "¡Hola! ¿Cómo estás?",
        time: "12:25",
        sent: false,
        read: true,
      },
      {
        id: 2,
        text: "¡Hola Ana! Todo bien por aquí",
        time: "12:27",
        sent: true,
        read: true,
      },
      {
        id: 3,
        text: "¿Qué tal tu día?",
        time: "12:30",
        sent: false,
        read: false,
      },
    ],
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    lastMessage: "Perfecto, nos vemos mañana",
    lastMessageTime: "11:45",
    unreadCount: 0,
    online: false,
    lastSeen: "hace 1 hora",
    messages: [
      {
        id: 1,
        text: "¿Confirmamos la reunión para mañana?",
        time: "11:40",
        sent: true,
        read: true,
      },
      {
        id: 2,
        text: "Perfecto, nos vemos mañana",
        time: "11:45",
        sent: false,
        read: true,
      },
    ],
  },
  {
    id: 3,
    name: "María López",
    lastMessage: "Gracias por la información",
    lastMessageTime: "Ayer",
    unreadCount: 0,
    online: false,
    lastSeen: "ayer",
    messages: [
      {
        id: 1,
        text: "Te envío los documentos que necesitas",
        time: "Ayer 15:30",
        sent: true,
        read: true,
      },
      {
        id: 2,
        text: "Gracias por la información",
        time: "Ayer 15:45",
        sent: false,
        read: true,
      },
    ],
  },
  {
    id: 4,
    name: "Equipo Desarrollo",
    lastMessage: "¡Nuevo mensaje!",
    lastMessageTime: "09:15",
    unreadCount: 5,
    online: true,
    lastSeen: "ahora",
    messages: [
      {
        id: 1,
        text: "Buenos días equipo",
        time: "09:00",
        sent: false,
        read: true,
      },
      {
        id: 2,
        text: "¡Nuevo mensaje!",
        time: "09:15",
        sent: false,
        read: false,
      },
    ],
  },
];

export { contacts };
