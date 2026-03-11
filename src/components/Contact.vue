<template>
  <div :class="[
    'flex flex-col h-full bg-[#13151a] w-full border-r border-gray-800 transition-all duration-300',
    isMobile && (cluster?.id || cluster?.clave) ? 'hidden' : 'block md:w-[380px] lg:w-[420px] flex-shrink-0'
  ]">

    <!-- Header Principal -->
    <div class="px-5 text-white py-4 bg-[#1a1d24] border-b border-gray-800 flex  items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <div class="relative group cursor-pointer" @click="openProfileModal">
          <img src="https://i.pravatar.cc/150?img=11" alt="Perfil"
            class="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
          <div class="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Settings class="w-4 h-4 text-white" />
          </div>
        </div>
        <div>
          <h2 class="font-semibold text-gray-100 text-base leading-tight">{{ user.nombre }}</h2>
          <p class="text-xs text-gray-400">@{{ user.apodo }}</p>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button
          class="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white" title="Nueva conversación">
          <MessageSquarePlus class="w-5 h-5" />
        </button>
        <button @click="openOptionsModal"
          class="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white" title="Opciones">
          <MoreVertical class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Buscador -->
    <div class="p-3 bg-[#13151a] border-b border-gray-800 flex-shrink-0">
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search class="h-5 w-5 text-gray-400 group-focus-within:text-gray-200 transition-colors" />
        </div>
        <input v-model="searchQuery" type="text" placeholder="Buscar un chat o iniciar uno nuevo"
          class="w-full bg-[#1e2128] text-gray-100 border border-gray-700/50 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-whatsapp-dark-blue focus:border-whatsapp-dark-blue transition-all duration-300 placeholder-gray-500 text-[15px] shadow-sm">
      </div>
    </div>

    <ContactList :searchQuery="searchQuery" />

    <!-- Menú de opciones -->
    <OptionsMenu v-if="showOptionsMenu" @close="showOptionsMenu = false" @new-group="handleNewGroup"
      @join-group="handleJoinGroup" @new-contact="() => { }" @settings="() => { }" @logout="handleLogout"
      @admin-panel="goToAdmin" />

    <!-- Modal para unirse a grupo -->
    <JoinGroupModal v-if="showJoinGroupModal" @close="showJoinGroupModal = false" @join="joinGroup" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  MoreVertical,
  MessageSquarePlus,
  Settings,
  Search
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/user'
import useUserGroupStore from '@/stores/userGroup'
import useClusterStore from '@/stores/cluster'

import ContactList from './list/ContactList.vue'
import OptionsMenu from './OptionsMenu.vue'
import JoinGroupModal from './JoinGroupModal.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const router = useRouter()
const { cluster } = storeToRefs(useClusterStore())
const userGroupStore = useUserGroupStore()

// Props
interface Props {
  isMobile: boolean
}

defineProps<Props>()

// Reactive data
const showOptionsMenu = ref(false)
const showJoinGroupModal = ref(false)
const searchQuery = ref('')

const openOptionsModal = () => {
  showOptionsMenu.value = true
}

const openProfileModal = () => {
  console.log('Open profile modal')
}

// Handlers for OptionsMenu
const handleNewGroup = () => {
  showOptionsMenu.value = false
  // showCreateGroupModal.value = true
}

const handleJoinGroup = () => {
  showOptionsMenu.value = false
  showJoinGroupModal.value = true
}

const goToAdmin = () => {
  showOptionsMenu.value = false
  router.push('/admin')
}

const handleLogout = () => {
  showOptionsMenu.value = false
  userStore.logout()
}

const joinGroup = async (groupCode: string) => {
  try {
    await userGroupStore.addUserToGroup(groupCode)
    showJoinGroupModal.value = false
    console.log('Te has unido al grupo exitosamente')
  } catch (error) {
    console.error('Error al unirse al grupo', error)
  }
}

</script>

<style scoped>
/* Scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3));
  border-radius: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(37, 99, 235, 0.5));
}

/* Animaciones suaves */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efectos glassmorphism para la búsqueda */
input {
  backdrop-filter: blur(10px);
}

/* Hover effects mejorados */
.group:hover .group-hover\:text-blue-700 {
  color: rgb(29 78 216);
}

/* Sombras suaves */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Animación del avatar */
.group:hover .relative {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

/* Estado activo mejorado */
.ring-2 {
  border: 2px solid rgb(147 197 253);
}
</style>
