<template>
  <!-- Overlay del modal -->
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" @click="$emit('close')">
    <!-- Contenido del menú -->
    <div
      class="bg-white rounded-2xl shadow-2xl p-6 md:w-6/12 transform transition-all duration-300 scale-100"
      @click.stop>
      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Opciones</h2>
        <p class="text-gray-500 mt-1">Selecciona una acción</p>
      </div>

      <!-- Opciones del menú -->
      <div class="space-y-3 md:grid md:grid-cols-2 md:gap-2">
        <button @click="$emit('new-group')"
          class="w-full flex items-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 group">
          <div
            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
            <Users class="w-6 h-6 text-white" />
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-800 group-hover:text-blue-700">Nuevo Grupo</h3>
            <p class="text-sm text-gray-500">Crear un grupo de chat</p>
          </div>
        </button>

        <button @click="$emit('join-group')"
          class="w-full flex items-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-200 group">
          <div
            class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
            <UserPlus class="w-6 h-6 text-white" />
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-800 group-hover:text-green-700">Unirse a Grupo</h3>
            <p class="text-sm text-gray-500">Ingresar con código de grupo</p>
          </div>
        </button>

        <button @click="$emit('new-contact')"
          class="w-full flex items-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all duration-200 group">
          <div
            class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <UserPlus class="w-6 h-6 text-white" />
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-800 group-hover:text-purple-700">Nuevo Contacto</h3>
            <p class="text-sm text-gray-500">Agregar un nuevo contacto</p>
          </div>
        </button>

        <button @click="$emit('settings')"
          class="w-full flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
          <div
            class="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-4">
            <Settings class="w-6 h-6 text-white" />
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-800 group-hover:text-gray-700">Ajustes</h3>
            <p class="text-sm text-gray-500">Configurar la aplicación</p>
          </div>
        </button>

        <!-- Admin Panel (solo visible para admins) -->
        <button v-if="userStore.user.isAdmin" @click="$emit('admin-panel')"
          class="w-full flex items-center p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-all duration-200 group">
          <div
            class="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mr-4">
            <Shield class="w-6 h-6 text-white" />
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-800 group-hover:text-orange-700">Panel de Admin</h3>
            <p class="text-sm text-gray-500">Gestionar usuarios y grupos</p>
          </div>
        </button>
        <div class="border-t border-gray-200"></div>
        <button @click="$emit('logout')"
          class="w-full flex items-center p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-200 group">
          <div
            class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
            <UserPlus class="w-6 h-6 text-white" />
          </div>
          <div class="text-left">
            <h3 class="font-semibold text-gray-800 group-hover:text-red-700">Cerrar Sesión</h3>
            <p class="text-sm text-gray-500">Salir de la cuenta actual</p>
          </div>
        </button>
      </div>

      <!-- Botón de cerrar -->
      <div class="mt-6 flex justify-center">
        <button @click="$emit('close')"
          class="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-700 font-medium transition-all duration-200">
          Cancelar
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
