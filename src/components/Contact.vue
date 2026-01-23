<template>
  <div :class="[
    'bg-gradient-to-b from-slate-50 to-white shadow-lg flex flex-col transition-all duration-300',
    cluster.clave && isMobile ? 'hidden' : 'w-full md:w-[30%]'
  ]">
    <!-- Header del sidebar -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 shadow-xl">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-white">Mensajes</h1>
        <button @click="showOptionsMenu = true"
          class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
          <MoreVertical class="w-6 h-6 text-white" />
        </button>
      </div>

      <!-- Barra de búsqueda -->
      <div class="relative">
        <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
        <input v-model="searchQuery" type="text" placeholder="Buscar conversaciones..."
          class="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm rounded-2xl border-none placeholder-blue-200 text-white focus:ring-2 focus:ring-white/40 focus:outline-none transition-all duration-300" />
      </div>
    </div>

    <!-- Lista de contactos -->
    <ContactList :searchQuery="searchQuery" />

    <!-- Menú de opciones -->
    <OptionsMenu v-if="showOptionsMenu" @close="showOptionsMenu = false" @new-group="handleNewGroup"
      @join-group="handleJoinGroup" @new-contact="handleNewContact" @settings="handleSettings" @logout="handleLogout" />

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
