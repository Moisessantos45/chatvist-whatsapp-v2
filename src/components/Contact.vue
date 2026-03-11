<template>
  <div :class="[
    'bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
    cluster.clave && isMobile ? 'hidden' : 'w-full md:w-[350px] lg:w-[400px] shrink-0'
  ]">
    <!-- Header del sidebar -->
    <div class="bg-gray-50 border-b border-gray-200 px-5 pt-5 pb-4">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-gray-900 tracking-tight">Chats</h1>
        <button @click="showOptionsMenu = true"
          class="p-2 -mr-2 rounded-md hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer">
          <MoreVertical class="w-5 h-5" />
        </button>
      </div>

      <!-- Barra de búsqueda -->
      <div class="relative">
        <Search class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" stroke-width="2.5" />
        <input v-model="searchQuery" type="text" placeholder="Buscar o empezar un nuevo chat"
          class="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 placeholder-gray-400 text-sm text-gray-700 focus:border-gray-300 focus:ring-0 transition-colors" />
      </div>
    </div>

    <!-- Lista de contactos -->
    <ContactList :searchQuery="searchQuery" />

    <!-- Menú de opciones -->
    <OptionsMenu v-if="showOptionsMenu" @close="showOptionsMenu = false" @new-group="handleNewGroup"
      @join-group="handleJoinGroup" @new-contact="handleNewContact" @settings="handleSettings" @logout="handleLogout"
      @admin-panel="handleAdminPanel" />

    <!-- Modal para unirse a grupo -->
    <JoinGroupModal v-if="showJoinGroupModal" @close="showJoinGroupModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Search, MoreVertical } from 'lucide-vue-next'
import OptionsMenu from '@/components/OptionsMenu.vue'
import JoinGroupModal from '@/components/JoinGroupModal.vue'
import ContactList from './list/ContactList.vue'
import useClusterStore from '@/stores/cluster'
import useUserStore from '@/stores/user'


defineProps<{
  isMobile: boolean
}>()

const router = useRouter()

const userStore = useUserStore()
const clusterStore = useClusterStore()
const { cluster } = storeToRefs(clusterStore)

// Reactive data
const searchQuery = ref('')
const showOptionsMenu = ref(false)
const showJoinGroupModal = ref(false)


const handleNewGroup = () => {
  showOptionsMenu.value = false
}

const handleJoinGroup = () => {
  showOptionsMenu.value = false
  showJoinGroupModal.value = true
}

const handleNewContact = () => {
  showOptionsMenu.value = false
}

const handleSettings = () => {
  showOptionsMenu.value = false
  // Aquí puedes emitir un evento o manejar los ajustes
  console.log('Ajustes')
}

const handleAdminPanel = () => {
  showOptionsMenu.value = false
  router.push({ name: 'AdminPanel' })
}

const handleLogout = async () => {
  showOptionsMenu.value = false
  await userStore.logout().then(() => {
    router.replace({ name: 'Login' })
  });
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
