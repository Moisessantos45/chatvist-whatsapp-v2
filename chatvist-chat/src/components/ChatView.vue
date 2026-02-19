<template>
  <div :class="[
    'flex flex-col flex-1 transition-all duration-300',
    !cluster.clave && isMobile ? 'hidden' : 'flex'
  ]">
    <!-- Estado vacío cuando no hay chat seleccionado -->
    <div v-if="!cluster.clave" class="flex-1 flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <MessageCircle class="w-24 h-24 text-whatsapp-gray mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-600 mb-2">WhatsApp Web</h2>
        <p class="text-whatsapp-gray">Selecciona un chat para empezar a conversar</p>
      </div>
    </div>

    <!-- Vista del chat cuando hay uno seleccionado -->
    <div v-else class="flex flex-col h-full">
      <!-- Header del chat -->
      <div class="bg-white p-4 border-b border-gray-200 shadow-sm flex items-center">
        <!-- Botón de regreso (solo móvil) -->
        <button v-if="isMobile" @click="goBack" class="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft class="w-5 h-5 text-whatsapp-medium-blue" />
        </button>

        <!-- Info del contacto -->
        <div class="flex items-center flex-1">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-whatsapp-medium-blue to-whatsapp-sky-blue flex items-center justify-center text-white font-semibold mr-3">
            {{ cluster.nombre.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h3 class="font-medium text-gray-900">{{ cluster.nombre }}</h3>
          </div>
        </div>

        <!-- Acciones del chat -->
        <div class="flex items-center space-x-2">
          <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Search class="w-5 h-5 text-whatsapp-gray" />
          </button>
          <button @click="showChatOptionsModal = true" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical class="w-5 h-5 text-whatsapp-gray" />
          </button>
        </div>
      </div>

      <!-- Área de mensajes -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 bg-gray-50 chat-background">
        <div class="space-y-4">
          <div v-for="message in messages" :key="message.id" :class="[
            'flex',
            message.usuarioId === user.id ? 'justify-end' : 'justify-start'
          ]">
            <div :class="[
              'max-w-[70%] rounded-lg p-3 shadow-sm relative group',
              message.usuarioId === user.id
                ? 'bg-whatsapp-sky-blue text-white'
                : 'bg-white text-gray-800',
              isReplyingToMessage(message.id) ? 'ring-2 ring-whatsapp-medium-blue' : ''
            ]">
              <!-- Mensaje al que se está respondiendo -->
              <div v-if="message.respuestaId && message.respuestaId > 0"
                class="mb-2 p-2 rounded bg-black/10 border-l-4 border-whatsapp-medium-blue">
                <div v-if="getRepliedMessage(message.respuestaId)" class="text-xs">
                  <p class="opacity-70 truncate">
                    {{ getRepliedMessage(message.respuestaId)?.contenido }}
                  </p>
                </div>
                <div v-else class="text-xs opacity-70">
                  <p>Mensaje eliminado</p>
                </div>
              </div>

              <!-- Contenido del mensaje -->
              <p class="text-sm leading-relaxed">{{ message.contenido }}</p>

              <!-- Botón de respuesta (aparece al hover) -->
              <button @click="replyToMessage(message.id)"
                class="absolute top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100">
                <Reply class="w-4 h-4 text-white" />
              </button>

              <div class="flex items-center justify-end mt-1">
                <span :class="[
                  'text-xs',
                  message.usuarioId === user.id ? 'text-white/70' : 'text-whatsapp-gray'
                ]">
                  {{ formaterDate(message.fecha) }}
                </span>
                <Check v-if="message.usuarioId === user.id" :class="[
                  'w-4 h-4 ml-1',
                  true ? 'text-blue-200' : 'text-white/70'
                ]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input area -->
      <div class="bg-white border-t border-gray-200">
        <!-- Indicador de respuesta -->
        <div v-if="replyingToMessage" class="px-4 py-2 bg-gray-100 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <Reply class="w-4 h-4 text-whatsapp-medium-blue" />
              <div class="text-sm">
                <p class="font-medium text-gray-700">
                  Respondiendo a {{ getRepliedMessage(replyingToMessage)?.usuario.nombre ?? 'Usuario desconocido' }}
                </p>
                <p class="text-gray-500 truncate max-w-xs">
                  {{ getRepliedMessage(replyingToMessage)?.contenido }}
                </p>
              </div>
            </div>
            <button @click="cancelReply" class="p-1 rounded-full hover:bg-gray-200 transition-colors">
              <X class="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div class="p-4">
          <div class="flex items-end space-x-3">
            <button class="p-2 rounded-full hover:bg-gray-100 transition-colors mb-1">
              <Paperclip class="w-5 h-5 text-whatsapp-gray" />
            </button>

            <div class="flex-1 relative">
              <!-- Lista de menciones -->
              <div v-if="showMentionList && filteredUsers.length > 0"
                class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                <div v-for="(user, index) in filteredUsers" :key="user.id" @click="selectMention(user)" :class="[
                  'px-4 py-2 cursor-pointer flex items-center space-x-2',
                  index === selectedMentionIndex ? 'bg-whatsapp-sky-blue text-white' : 'hover:bg-gray-100'
                ]">
                  <div
                    class="w-8 h-8 rounded-full bg-gradient-to-br from-whatsapp-medium-blue to-whatsapp-sky-blue flex items-center justify-center text-white text-sm font-semibold">
                    {{ user.nombre.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm">{{ user.nombre }}</span>
                </div>
              </div>

              <textarea ref="textareaRef" v-model="message.contenido"
                @input="(e) => { handleInput(e); adjustTextareaHeight(); }" @keydown="handleKeyDown"
                placeholder="Escribe un mensaje..." rows="1"
                class="w-full px-4 py-2 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-whatsapp-medium-blue focus:outline-none transition-all resize-none overflow-hidden"
                style="min-height: 40px; max-height: 120px;">
              </textarea>

              <button
                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors">
                <Smile class="w-5 h-5 text-whatsapp-gray" />
              </button>
            </div>

            <button @click="handleSendMessage" :disabled="!message.contenido.trim()" :class="[
              'p-3 rounded-full transition-all duration-200 transform mb-1',
              message.contenido.trim()
                ? 'bg-whatsapp-dark-blue text-white hover:bg-whatsapp-medium-blue hover:scale-105 shadow-lg'
                : 'bg-gray-200 text-whatsapp-gray cursor-not-allowed'
            ]">
              <Send class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de opciones del chat -->
    <ChatOptionsModal :show="showChatOptionsModal" :group-code="cluster.clave" :group-name="cluster.nombre"
      @close="showChatOptionsModal = false" @share-group-code="handleShareGroupCode" @add-member="handleAddMember"
      @view-info="handleViewInfo" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  MessageCircle,
  Search,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Smile,
  Send,
  Check,
  Reply,
  X
} from 'lucide-vue-next'
import useClusterStore from '@/stores/cluster'
import useUserStore from '@/stores/user'
import useMessageStore from '@/stores/message'
import ChatOptionsModal from '@/components/ChatOptionsModal.vue'

// Props
interface Props {
  isMobile: boolean
}

const clusterStore = useClusterStore()
const userStore = useUserStore()
const messageStore = useMessageStore()
const { cluster } = storeToRefs(clusterStore)
const { user, filteredUsers, selectedMentionIndex } = storeToRefs(userStore)
const { messages, message, replyingToMessage } = storeToRefs(messageStore)

defineProps<Props>()

// Emits
defineEmits<{
  goBack: []
}>()

// Reactive data
const messagesContainer = ref<HTMLElement | null>(null)
const showChatOptionsModal = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const showMentionList = ref(false)
const mentionSearch = ref('')
const mentionStartPos = ref(0)

// Methods
const handleSendMessage = async () => {
  const success = await messageStore.sendMessage(cluster.value.id, cluster.value.clave)
  if (success) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const replyToMessage = (messageId: number) => {
  messageStore.replyToMessage(messageId)
}

const cancelReply = () => {
  messageStore.cancelReply()
}

const getRepliedMessage = (respuestaId: number) => {
  return messageStore.getRepliedMessage(respuestaId)
}

const isReplyingToMessage = (messageId: number) => {
  return messageStore.isReplyingToMessage(messageId)
}

// Computed para obtener usuarios únicos del grupo
const groupUsers = computed(() => {
  return userStore.getGroupUsers(messages.value)
})

// Funciones para manejar menciones
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const cursorPos = target.selectionStart || 0
  const text = target.value

  // Buscar el último @ antes del cursor
  const textBeforeCursor = text.substring(0, cursorPos)
  const lastAtIndex = textBeforeCursor.lastIndexOf('@')

  if (lastAtIndex !== -1) {
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1)

    // Si no hay espacios después del @, mostrar lista de menciones
    if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
      mentionStartPos.value = lastAtIndex
      mentionSearch.value = textAfterAt
      updateFilteredUsers()
      showMentionList.value = true
      return
    }
  }

  // Ocultar lista de menciones si no se está mencionando
  showMentionList.value = false
}

const updateFilteredUsers = () => {
  userStore.updateFilteredUsers(groupUsers.value, mentionSearch.value)
}

const selectMention = (selectedUser: any) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const text = message.value.contenido
  const beforeMention = text.substring(0, mentionStartPos.value)
  const afterCursor = text.substring(textarea.selectionStart || 0)

  message.value.contenido = beforeMention + `@${selectedUser.nombre} ` + afterCursor
  showMentionList.value = false

  // Mover el cursor después de la mención
  nextTick(() => {
    const newPos = beforeMention.length + selectedUser.nombre.length + 2
    textarea.focus()
    textarea.setSelectionRange(newPos, newPos)
  })
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (showMentionList.value) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      userStore.navigateMentionList('down')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      userStore.navigateMentionList('up')
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const selectedUser = userStore.getSelectedMentionUser()
      if (selectedUser) {
        selectMention(selectedUser)
      }
      return
    } else if (event.key === 'Escape') {
      showMentionList.value = false
      return
    }
  }

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSendMessage()
  }
}

const adjustTextareaHeight = () => {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
}

const goBack = () => {
  clusterStore.resetClusterStore()
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formaterDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

// Métodos para el modal de opciones
const handleShareGroupCode = () => {
  showChatOptionsModal.value = false
}

const handleAddMember = () => {
  showChatOptionsModal.value = false
}

const handleViewInfo = () => {
  showChatOptionsModal.value = false
}

// Watch for selectedChat changes to scroll to bottom
watch(() => cluster.value, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// Watch for message content changes to adjust textarea height
watch(() => message.value.contenido, () => {
  nextTick(() => {
    adjustTextareaHeight()
  })
})
</script>

<style scoped>
.chat-background {
  background-image:
    radial-gradient(circle at 20% 80%, rgba(208, 208, 208, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(208, 208, 208, 0.1) 0%, transparent 50%);
  background-size: 20px 20px;
}

/* Scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Animaciones suaves */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
