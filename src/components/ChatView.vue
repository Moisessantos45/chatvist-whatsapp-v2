<template>
  <div :class="[
    'flex flex-col flex-1 transition-all duration-300',
    !cluster.clave && isMobile ? 'hidden' : 'flex'
  ]">
    <!-- Estado vacío cuando no hay chat seleccionado -->
    <div v-if="!cluster.clave" class="flex-1 flex items-center justify-center bg-gray-50/50">
      <div class="text-center">
        <MessageCircle class="w-20 h-20 text-gray-300 mx-auto mb-5 stroke-[1.5]" />
        <h2 class="text-lg font-medium text-gray-800 mb-2">WhatsApp Clone</h2>
        <p class="text-sm text-gray-500 font-medium">Selecciona un chat para empezar a conversar</p>
      </div>
    </div>

    <!-- Vista del chat cuando hay uno seleccionado -->
    <div v-else class="flex flex-col h-full bg-white">
      <!-- Header del chat -->
      <div class="bg-white px-5 py-3 border-b border-gray-100 flex items-center">
        <!-- Botón de regreso (solo móvil) -->
        <button v-if="isMobile" @click="goBack" class="mr-3 p-2 -ml-2 rounded-md hover:bg-gray-50 transition-colors">
          <ArrowLeft class="w-5 h-5 text-gray-600" />
        </button>

        <!-- Info del contacto -->
        <div class="flex items-center flex-1 cursor-pointer">
          <div
            class="w-10 h-10 rounded-full bg-whatsapp-dark-blue flex items-center justify-center text-white font-semibold mr-3 shadow-sm">
            {{ cluster.nombre.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 leading-tight">{{ cluster.nombre }}</h3>
          </div>
        </div>

        <!-- Acciones del chat -->
        <div class="flex items-center space-x-1">
          <button class="p-2 rounded-md hover:bg-gray-50 transition-colors">
            <Search class="w-5 h-5 text-gray-500" />
          </button>
          <button @click="showChatOptionsModal = true" class="p-2 rounded-md hover:bg-gray-50 transition-colors">
            <MoreVertical class="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <!-- Área de mensajes -->
      <div class="flex-1 relative flex flex-col overflow-hidden bg-[#EFEAE2] chat-background">
        <div ref="messagesContainer" @scroll="handleScroll" class="flex-1 overflow-y-auto px-5 py-6">
          <div class="space-y-3">
            <div v-for="message in messages" :key="message.id" :class="[
              'flex',
              message.usuarioId === user.id ? 'justify-end' : 'justify-start'
            ]">
              <div :class="[
                'max-w-[75%] rounded-lg px-3 py-2 shadow-sm relative group',
                message.usuarioId === user.id
                  ? 'bg-[#D9FDD3] text-gray-900 rounded-tr-none'
                  : 'bg-white text-gray-900 rounded-tl-none',
                isReplyingToMessage(message.id) ? 'ring-2 ring-whatsapp-dark-blue/50 ring-offset-2 ring-offset-[#EFEAE2]' : ''
              ]">
                <!-- Mensaje al que se está respondiendo -->
                <div v-if="message.respuestaId && message.respuestaId > 0"
                  class="mb-2 p-2 rounded-md bg-black/5 border-l-4 border-whatsapp-medium-blue cursor-pointer transition-colors hover:bg-black/10">
                  <div v-if="getRepliedMessage(message.respuestaId)" class="text-xs">
                    <p class="text-gray-800 font-medium mb-1 truncate">
                        {{ getRepliedMessage(message.respuestaId)?.senderApodo || getRepliedMessage(message.respuestaId)?.usuario?.apodo || 'Usuario' }}
                    </p>
                    <p class="text-gray-600 truncate">
                      {{ getRepliedMessage(message.respuestaId)?.contenido }}
                    </p>
                  </div>
                  <div v-else class="text-xs text-gray-500 italic">
                    <p>Mensaje eliminado</p>
                  </div>
                </div>

                <!-- Nombre del usuario (solo para mensajes de otros) -->
                <div v-if="message.usuarioId !== user.id" class="text-[13px] font-semibold text-whatsapp-medium-blue mb-1">
                  {{ message.senderApodo || message.usuario?.apodo || 'Desconocido' }}
                </div>

                <!-- Contenido del mensaje -->
                <p class="text-[15px] leading-relaxed break-words pr-12">{{ message.contenido }}</p>

                <!-- Botón de respuesta (aparece al hover) -->
                <button @click="replyToMessage(message.id)"
                  class="absolute top-2 -right-10 p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 border border-gray-100">
                  <Reply class="w-4 h-4 text-gray-500" />
                </button>

                <div class="absolute bottom-1 right-2 flex items-center">
                  <span class="text-[11px] text-gray-500 font-medium">
                    {{ formaterDate(message.fecha) }}
                  </span>
                  <Check v-if="message.usuarioId === user.id" :class="[
                    'w-3.5 h-3.5 ml-1',
                    true ? 'text-blue-500' : 'text-gray-400'
                  ]" />
                </div>
              </div>
            </div>
          </div>

          <!-- Botón flotante para ir al final -->
          <button v-if="showScrollButton" @click="scrollToBottom"
            class="absolute bottom-4 right-5 z-10 p-2.5 rounded-full bg-white shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center group"
            aria-label="Ir al último mensaje">
            <ChevronDown class="w-5 h-5 text-gray-600" />
            <span v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 bg-whatsapp-light text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>
        </div>

        <!-- Input area -->
        <div class="bg-[#F0F2F5] px-4 py-3 border-t border-gray-200">
          <!-- Indicador de respuesta -->
          <div v-if="replyingToMessage" class="mb-3 mx-2 relative overflow-hidden bg-white rounded-lg border-l-4 border-whatsapp-medium-blue shadow-sm">
            <div class="p-3 pr-10">
                <p class="text-[13px] font-semibold text-whatsapp-medium-blue mb-1">
                  {{ getRepliedMessage(replyingToMessage)?.senderApodo ||
                    getRepliedMessage(replyingToMessage)?.usuario?.apodo || 'Usuario desconocido' }}
                </p>
                <p class="text-sm text-gray-600 truncate">
                  {{ getRepliedMessage(replyingToMessage)?.contenido }}
                </p>
            </div>
            <button @click="cancelReply" class="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-100 transition-colors">
              <X class="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div class="flex items-end space-x-2">
            <button class="p-2 sm:p-3 rounded-full hover:bg-black/5 transition-colors mb-0.5 text-gray-500">
              <Smile class="w-6 h-6 sm:w-7 sm:h-7" stroke-width="1.5" />
            </button>
            <button class="p-2 sm:p-3 rounded-full hover:bg-black/5 transition-colors mb-0.5 text-gray-500 hidden sm:block">
              <Paperclip class="w-6 h-6 sm:w-7 sm:h-7" stroke-width="1.5" />
            </button>

            <div class="flex-1 relative">
              <!-- Lista de menciones -->
              <div v-if="showMentionList && filteredUsers.length > 0"
                class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10 py-1">
                <div v-for="(user, index) in filteredUsers" :key="user.id" @click="selectMention(user)" :class="[
                  'px-4 py-2 cursor-pointer flex items-center space-x-3 transition-colors',
                  index === selectedMentionIndex ? 'bg-gray-50' : 'hover:bg-gray-50'
                ]">
                  <div
                    class="w-8 h-8 rounded-full bg-whatsapp-medium-blue flex items-center justify-center text-white text-sm font-semibold">
                    {{ user.nombre.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ user.nombre }}</span>
                </div>
              </div>

              <textarea ref="textareaRef" v-model="message.contenido"
                @input="(e) => { handleInput(e); adjustTextareaHeight(); }" @keydown="handleKeyDown"
                placeholder="Escribe un mensaje" rows="1"
                class="w-full px-4 py-2.5 bg-white rounded-lg border border-transparent focus:border-transparent focus:ring-0 transition-colors resize-none overflow-y-auto text-gray-900 placeholder-gray-500"
                style="min-height: 44px; max-height: 120px;">
              </textarea>
            </div>

            <button @click="handleSendMessage" :disabled="!message.contenido.trim()" :class="[
              'p-2.5 sm:p-3 rounded-full transition-colors mb-0.5',
              message.contenido.trim()
                ? 'bg-whatsapp-dark-blue text-white hover:bg-whatsapp-medium-blue'
                : 'text-gray-400 cursor-not-allowed hover:bg-black/5'
            ]">
              <Send class="w-5 h-5 sm:w-6 sm:h-6" :class="{ 'ml-1': message.contenido.trim() }" />
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de opciones del chat -->
      <ChatOptionsModal :show="showChatOptionsModal" :group-code="cluster.clave" :group-name="cluster.nombre"
        @close="showChatOptionsModal = false" @share-group-code="handleShareGroupCode" @add-member="handleAddMember"
        @view-info="handleViewInfo" />
    </div>
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
  X,
  ChevronDown
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

const isAtBottom = ref(true)
const showScrollButton = ref(false)
const unreadCount = ref(0)

const handleScroll = () => {
  if (!messagesContainer.value) return

  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight

  isAtBottom.value = distanceFromBottom < 100
  showScrollButton.value = distanceFromBottom >= 100

  if (isAtBottom.value) {
    unreadCount.value = 0
  }
}

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

// Watch for messages to add smart auto-scroll
watch(() => messages.value.length, (newLen, oldLen) => {
  if (newLen > oldLen && newLen > 0) {
    const lastMessage = messages.value[newLen - 1]

    if (isAtBottom.value || lastMessage.usuarioId === user.value.id) {
      nextTick(() => {
        scrollToBottom()
      })
    } else if (lastMessage.usuarioId !== user.value.id) {
      unreadCount.value++
    }
  }
})

// Watch for selectedChat changes to scroll to bottom
watch(() => cluster.value, () => {
  unreadCount.value = 0
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
