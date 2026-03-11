<template>
  <!-- Overlay del modal -->
  <div class="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 transition-opacity" @click="$emit('close')">
    <!-- Contenido del menú -->
    <div
      class="bg-[#1a1d24] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-gray-800 w-full max-w-md transform transition-all"
      @click.stop>
      <!-- Header -->
      <div class="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-100">Opciones</h2>
        <button @click="$emit('close')" class="p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
           <span class="sr-only">Cerrar</span>
           <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Opciones del menú -->
      <div class="py-2 flex flex-col">
        <button @click="$emit('new-group')"
          class="w-full flex items-center px-6 py-3.5 hover:bg-white/5 transition-colors group text-left">
          <div
            class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mr-4 group-hover:bg-white/10 group-hover:shadow-sm border border-transparent transition-all">
            <Users class="w-5 h-5 text-gray-300" />
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-100">Nuevo Grupo</h3>
            <p class="text-[13px] text-gray-400">Crear un grupo de chat</p>
          </div>
        </button>

        <button @click="$emit('join-group')"
          class="w-full flex items-center px-6 py-3.5 hover:bg-white/5 transition-colors group text-left">
          <div
            class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mr-4 group-hover:bg-white/10 group-hover:shadow-sm border border-transparent transition-all">
            <UserPlus class="w-5 h-5 text-gray-300" />
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-100">Unirse a Grupo</h3>
            <p class="text-[13px] text-gray-400">Ingresar con código de grupo</p>
          </div>
        </button>

        <button @click="$emit('new-contact')"
          class="w-full flex items-center px-6 py-3.5 hover:bg-white/5 transition-colors group text-left">
          <div
            class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mr-4 group-hover:bg-white/10 group-hover:shadow-sm border border-transparent transition-all">
            <UserPlus class="w-5 h-5 text-gray-300" />
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-100">Nuevo Contacto</h3>
            <p class="text-[13px] text-gray-400">Agregar un nuevo contacto</p>
          </div>
        </button>

        <button @click="$emit('settings')"
          class="w-full flex items-center px-6 py-3.5 hover:bg-white/5 transition-colors group text-left">
          <div
            class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mr-4 group-hover:bg-white/10 group-hover:shadow-sm border border-transparent transition-all">
            <Settings class="w-5 h-5 text-gray-300" />
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-100">Ajustes</h3>
            <p class="text-[13px] text-gray-400">Configurar la aplicación</p>
          </div>
        </button>

        <!-- Admin Panel (solo visible para admins) -->
        <template v-if="userStore.user.isAdmin">
            <div class="h-px bg-gray-800 my-1 mx-6"></div>
            <button @click="$emit('admin-panel')"
            class="w-full flex items-center px-6 py-3.5 hover:bg-white/5 transition-colors group text-left">
            <div
                class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mr-4 group-hover:bg-white/10 group-hover:shadow-sm border border-transparent transition-all">
                <Shield class="w-5 h-5 text-gray-300" />
            </div>
            <div class="flex-1">
                <h3 class="font-medium text-gray-100">Panel de Admin</h3>
                <p class="text-[13px] text-gray-400">Gestionar usuarios y grupos</p>
            </div>
            </button>
        </template>
        
        <div class="h-px bg-gray-800 my-1 mx-6"></div>
        
        <button @click="$emit('logout')"
          class="w-full flex items-center px-6 py-3.5 hover:bg-red-500/10 transition-colors group text-left">
          <div
            class="w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-red-500/20 group-hover:shadow-sm border border-transparent transition-all">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-red-500">Cerrar Sesión</h3>
            <p class="text-[13px] text-red-400/70">Salir de la cuenta actual</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, UserPlus, Settings, Shield } from 'lucide-vue-next'
import useUserStore from '@/stores/user'

const userStore = useUserStore()

// Emits
defineEmits<{
  close: []
  'new-group': []
  'join-group': []
  'new-contact': []
  'admin-panel': []
  "logout": []
  settings: []
}>()
</script>

<style scoped>
/* Animación de entrada */
@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.transform {
  animation: modalEnter 0.2s ease-out;
}
</style>
