# Chatvist Chat — Frontend

Cliente web de mensajería en tiempo real construido con **Vue 3**, **TypeScript** y **Vite**. Consume la API REST y WebSocket del backend de Chatvist para ofrecer chat grupal, gestión de usuarios y panel de administración.

---

## Tabla de Contenidos

- [Tecnologías y Librerías](#tecnologías-y-librerías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Vistas y Rutas](#vistas-y-rutas)
- [Stores (Pinia)](#stores-pinia)
- [Cómo Funcionan los WebSockets](#cómo-funcionan-los-websockets)
- [Tipos de Datos](#tipos-de-datos)
- [Autenticación](#autenticación)

---

## Tecnologías y Librerías

### Core

| Librería                                      | Versión   | Uso                                                      |
| --------------------------------------------- | --------- | -------------------------------------------------------- |
| [Vue 3](https://vuejs.org/)                   | `^3.5.18` | Framework principal (Composition API + `<script setup>`) |
| [TypeScript](https://www.typescriptlang.org/) | `~5.8.3`  | Tipado estático                                          |
| [Vite](https://vite.dev/)                     | `^7.1.2`  | Build tool y dev server                                  |

### State Management y Routing

| Librería                                | Versión  | Uso                                        |
| --------------------------------------- | -------- | ------------------------------------------ |
| [Pinia](https://pinia.vuejs.org/)       | `^3.0.3` | Gestión del estado global (stores)         |
| [Vue Router](https://router.vuejs.org/) | `4`      | Navegación SPA con guards de autenticación |

### HTTP y Comunicación

| Librería                         | Versión   | Uso                                     |
| -------------------------------- | --------- | --------------------------------------- |
| [Axios](https://axios-http.com/) | `^1.11.0` | Llamadas HTTP a la API REST del backend |
| WebSocket API (nativa)           | —         | Mensajería en tiempo real               |

### UI y Estilos

| Librería                                                         | Versión    | Uso                            |
| ---------------------------------------------------------------- | ---------- | ------------------------------ |
| [Tailwind CSS](https://tailwindcss.com/)                         | `^4.1.12`  | Estilos utilitarios            |
| [@tailwindcss/vite](https://github.com/tailwindlabs/tailwindcss) | `^4.1.12`  | Plugin de integración con Vite |
| [Lucide Vue Next](https://lucide.dev/)                           | `^0.540.0` | Íconos SVG                     |
| [Vue3 Toastify](https://vue3-toastify.js.org/)                   | `^0.2.8`   | Notificaciones toast           |

### Dev Tools

| Librería             | Versión  | Uso                                       |
| -------------------- | -------- | ----------------------------------------- |
| `@vitejs/plugin-vue` | `^6.0.1` | Soporte de archivos `.vue` en Vite        |
| `vue-tsc`            | `^3.0.5` | Type-checking de Vue con TypeScript       |
| `@vue/tsconfig`      | `^0.7.0` | Configuración base de TypeScript para Vue |

---

## Requisitos Previos

- [Bun](https://bun.sh/) v1.x o superior (gestor de paquetes y runtime)
- Backend de Chatvist corriendo (API REST + servidor WebSocket)

---

## Instalación y Configuración

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd chatvist-chat

# 2. Instalar dependencias con Bun
bun install

# 3. Copiar el archivo de variables de entorno
cp example.env .env

# 4. Editar .env con los valores correctos
# (ver sección Variables de Entorno)

# 5. Iniciar el servidor de desarrollo
bun run dev
```

---

## Variables de Entorno

Copia `example.env` como `.env` y ajusta los valores:

```env
# Host de la API REST del backend
# El backend muestra en consola el puerto donde está corriendo
VITE_HOST_API=http://localhost:4100

# URL del WebSocket para mensajes en tiempo real
# Definida en las rutas de WebSocket del backend
VITE_URL_WS=ws://localhost:4100/api/public/ws/message
```

> **Nota:** Las variables en Vite deben tener el prefijo `VITE_` para ser accesibles desde el código del cliente mediante `import.meta.env.VITE_*`.

---

## Scripts Disponibles

```bash
bun run dev       # Inicia el servidor de desarrollo con hot-reload
bun run build     # Compila TypeScript y genera el bundle de producción
bun run preview   # Sirve el build de producción localmente
```

---

## Arquitectura del Proyecto

```
src/
├── main.ts              # Punto de entrada: monta la app, registra Pinia y Router
├── App.vue              # Componente raíz
├── style.css            # Estilos globales
│
├── views/               # Páginas completas (una por ruta)
│   ├── Home.vue         # Página de inicio / landing
│   ├── Login.vue        # Formulario de inicio de sesión
│   ├── Register.vue     # Formulario de registro de usuario
│   ├── Dashboard.vue    # Interfaz principal del chat (requiere auth)
│   └── AdminPanel.vue   # Panel de administración (requiere rol admin)
│
├── components/          # Componentes reutilizables
│   ├── ChatView.vue     # Vista del chat activo con mensajes
│   ├── ContactList.vue  # Lista de grupos/contactos del usuario
│   ├── Contact.vue      # Ítem individual de contacto/grupo
│   ├── JoinGroupModal.vue   # Modal para unirse a un grupo
│   ├── ChatOptionsModal.vue # Modal de opciones del chat
│   ├── OptionsMenu.vue  # Menú de opciones generales
│   ├── admin/           # Componentes exclusivos del panel admin
│   └── list/            # Componentes de listas
│
├── stores/              # Estado global con Pinia
│   ├── webSocket.ts     # Conexión y mensajería WebSocket
│   ├── message.ts       # Mensajes del chat (CRUD + respuestas)
│   ├── user.ts          # Usuario autenticado y operaciones de auth
│   ├── cluster.ts       # Grupos de chat (clusters)
│   ├── userGroup.ts     # Relación usuario-grupo
│   └── admin.ts         # Operaciones del panel de administración
│
├── types/               # Interfaces TypeScript
│   ├── message.ts       # Tipo Message
│   ├── user.ts          # Tipo User
│   ├── cluster.ts       # Tipo Cluster
│   ├── chat.ts          # Tipo Chat
│   └── userGroup.ts     # Tipo UserGroup
│
├── mappers/             # Funciones de transformación de datos API → app
│   ├── message.ts       # Mapea respuestas del backend a tipo Message
│   ├── user.ts          # Mapea respuestas del backend a tipo User
│   ├── cluster.ts       # Mapea respuestas del backend a tipo Cluster
│   └── (otros)
│
├── router/
│   └── router.ts        # Definición de rutas y navigation guards
│
├── service/
│   └── notification.ts  # Servicio de notificaciones toast (vue3-toastify)
│
├── utils/               # Utilidades generales
└── data/                # Datos estáticos o configuraciones
```

---

## Vistas y Rutas

| Ruta        | Nombre       | Vista            | Protegida                     |
| ----------- | ------------ | ---------------- | ----------------------------- |
| `/`         | `Home`       | `Home.vue`       | No                            |
| `/login`    | `Login`      | `Login.vue`      | No                            |
| `/register` | `Register`   | `Register.vue`   | No                            |
| `/chat`     | `Dashboard`  | `Dashboard.vue`  | ✅ Requiere token             |
| `/admin`    | `AdminPanel` | `AdminPanel.vue` | ✅ Requiere token + rol admin |

El router usa `navigation guards` (`beforeEach`) para proteger rutas:

- Si la ruta requiere autenticación (`requiresAuth: true`) y no hay token en `localStorage`, redirige a `/login`.
- Si la ruta requiere ser admin (`requiresAdmin: true`) y el usuario no tiene el rol, redirige a `/chat`.

---

## Stores (Pinia)

Todos los stores usan la **Composition API** de Pinia (`defineStore` con function setup).

### `useWebSocketStore`

Gestiona la conexión WebSocket de tiempo real.

- `connect()` — Abre la conexión, envía el token JWT al servidor para autenticación.
- `disconnect()` — Cierra la conexión limpiamente.
- `sendMessage(msg)` — Serializa y envía un mensaje al servidor por WebSocket.
- Estado: `ws`, `isConnected`, `error`.

### `useMessageStore`

Gestiona los mensajes del chat activo.

- `getAllMessagesCluster(id)` — Obtiene todos los mensajes de un grupo vía REST.
- `sendMessage(clusterId, clusterKey)` — Registra el mensaje en la API y lo difunde por WebSocket.
- `addAnswerToMessage(message)` — Añade a la lista local un mensaje recibido por WebSocket.
- `replyToMessage(id)` / `cancelReply()` — Gestiona el estado de respuesta a mensajes.
- `getRepliedMessage(id)` — Recupera el mensaje al que se está respondiendo.

### `useUserStore`

Gestiona el usuario autenticado.

- `login(email, password)` — Autentica al usuario, guarda el JWT en `localStorage`.
- `logout()` — Invalida sesión en el backend y limpia el estado local.
- `getUser()` — Obtiene los datos del usuario usando el token almacenado.
- `register()` — Registra un nuevo usuario en el sistema.
- Utilidades de menciones: `getGroupUsers()`, `updateFilteredUsers()`, `navigateMentionList()`.

### `useClusterStore`

Gestiona los grupos de chat (clusters).

- `getAllClustersUser()` — Obtiene todos los grupos a los que pertenece el usuario.
- `resetClusterStore()` — Limpia el cluster activo.

### `useAdminStore`

Operaciones exclusivas del panel de administración (gestión de usuarios, grupos, etc.).

---

## Cómo Funcionan los WebSockets

La comunicación en tiempo real se implementa sobre la **API nativa de WebSocket** del navegador, gestionada en `useWebSocketStore`.

### Flujo de Conexión

```
1. Usuario se autentica (login)
          ↓
2. Dashboard llama a webSocketStore.connect()
          ↓
3. Se abre conexión: new WebSocket(VITE_URL_WS)
          ↓
4. onopen → Se envía el JWT al servidor:
   ws.send(JSON.stringify({ token: "Bearer eyJ..." }))
          ↓
5. Servidor valida el token y responde:
   "authentication_successful"
          ↓
6. Conexión lista para enviar/recibir mensajes
```

### Envío de un Mensaje

```
Usuario escribe y envía
          ↓
messageStore.sendMessage(clusterId, clusterKey)
          ↓
1. POST /api/mensaje → guarda en base de datos
2. Respuesta incluye el mensaje con ID generado
3. webSocketStore.sendMessage(newMessage) →
   ws.send(JSON.stringify({
     id, senderId, groupId, content,
     fecha, answerId, senderName, senderApodo
   }))
          ↓
Servidor difunde el mensaje a todos los miembros del grupo
```

### Recepción de un Mensaje

```
Servidor envía evento WebSocket
          ↓
ws.onmessage (en webSocketStore)
          ↓
JSON.parse(event.data) → mapToStringEntityMessage(message)
          ↓
messageStore.addAnswerToMessage(transformedMessage)
          ↓
Si groupId === cluster activo → se agrega a messages[]
Si groupId !== cluster activo → se ignora (evita contaminar el chat)
          ↓
Vue reacciona al cambio reactivo → UI actualizada automáticamente
```

### Cierre de Conexión

La conexión se cierra al hacer logout o al navegar fuera del Dashboard, llamando a `webSocketStore.disconnect()`.

---

## Tipos de Datos

### `Message`

```typescript
interface Message {
  id: number;
  contenido: string;
  fecha: Date;
  grupoId: number;
  groupIdStr?: string; // Clave string del grupo (para WS)
  usuarioId: number;
  respuestaId?: number; // ID del mensaje al que responde
  senderName?: string;
  senderApodo?: string;
  usuario: User;
}
```

### `User`

```typescript
interface User {
  id: number;
  nombre: string;
  apodo: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  // (entre otros campos)
}
```

### `Cluster` (Grupo de Chat)

```typescript
interface Cluster {
  id: number;
  nombre: string;
  clave: string; // Clave única string del grupo, usada en WebSocket
  // (entre otros campos)
}
```

---

## Autenticación

El sistema usa **JWT (JSON Web Tokens)** como mecanismo de autenticación:

1. Al hacer login, el backend devuelve un token que se almacena en `localStorage` como `bearerToken`.
2. Todas las peticiones HTTP a la API incluyen el header:
   ```
   Authorization: Bearer <token>
   ```
3. Al abrir la conexión WebSocket, el token se envía como primer mensaje para autenticar la sesión en tiempo real.
4. El navigation guard del router verifica la existencia del token antes de permitir el acceso a rutas protegidas.
5. Al hacer logout, el token se elimina de `localStorage` y se invalida en el servidor.
