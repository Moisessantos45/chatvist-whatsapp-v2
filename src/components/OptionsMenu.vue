<template>
  <!-- Overlay del modal -->
  <div class="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 transition-opacity" @click="$emit('close')">
    <!-- Contenido del menú -->
    <div
      class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-md transform transition-all"
      @click.stop>
      <!-- Header -->
      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Opciones</h2>
        <button @click="$emit('close')" class="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
           <span class="sr-only">Cerrar</span>
           <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Opciones del menú -->
      <div class="py-2 flex flex-col">
        <button @click="$emit('new-group')"
          class="w-full flex items-center px-6 py-3.5 hover:bg-gray-50 transition-colors group text-left">
          <div
            class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
            <Users class="w-5 h-5 text-gray-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Nuevo Grupo</h3>
            <p class="text-[13px] text-gray-500">Crear un grupo de chat</p>
          </div>
        </button>

        <button @click="$emit('join-group')"
          class="w-full flex items-center px-6 py-3.5 hover:bg-gray-50 transition-colors group text-left">
          <div
            class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
            <UserPlus class="w-5 h-5 text-gray-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Unirse a Grupo</h3>
            <p class="text-[13px] text-gray-500">Ingresar con código de grupo</p>
          </div>
        </button>

        <button @click="$emit('new-contact')"
          class="w-full flex items-center px-6 py-3.5 hover:bg-gray-50 transition-colors group text-left">
          <div
            class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
            <UserPlus class="w-5 h-5 text-gray-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Nuevo Contacto</h3>
            <p class="text-[13px] text-gray-500">Agregar un nuevo contacto</p>
          </div>
        </button>

        <button @click="$emit('settings')"
          class="w-full flex items-center px-6 py-3.5 hover:bg-gray-50 transition-colors group text-left">
          <div
            class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
            <Settings class="w-5 h-5 text-gray-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">Ajustes</h3>
            <p class="text-[13px] text-gray-500">Configurar la aplicación</p>
          </div>
        </button>

        <!-- Admin Panel (solo visible para admins) -->
        <template v-if="userStore.user.isAdmin">
            <div class="h-px bg-gray-100 my-1 mx-6"></div>
            <button @click="$emit('admin-panel')"
            class="w-full flex items-center px-6 py-3.5 hover:bg-gray-50 transition-colors group text-left">
            <div
                class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
                <Shield class="w-5 h-5 text-gray-600" />
            </div>
            <div class="flex-1">
                <h3 class="font-medium text-gray-900">Panel de Admin</h3>
                <p class="text-[13px] text-gray-500">Gestionar usuarios y grupos</p>
            </div>
            </button>
        </template>
        
        <div class="h-px bg-gray-100 my-1 mx-6"></div>
        
        <button @click="$emit('logout')"
          class="w-full flex items-center px-6 py-3.5 hover:bg-red-50/50 transition-colors group text-left">
          <div
            class="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-red-100 transition-all">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-red-600">Cerrar Sesión</h3>
            <p class="text-[13px] text-red-500/70">Salir de la cuenta actual</p>
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
