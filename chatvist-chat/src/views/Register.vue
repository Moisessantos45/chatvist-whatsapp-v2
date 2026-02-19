<template>
  <div
    class="min-h-screen bg-gradient-to-br from-whatsapp-dark-blue to-whatsapp-sky-blue flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300">
      <div class="text-center mb-8">
        <div
          class="w-20 h-20 bg-gradient-to-r from-whatsapp-dark-blue to-whatsapp-sky-blue rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h1>
        <p class="text-whatsapp-gray">Únete a WhatsApp Web hoy</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
            <input v-model="newUser.nombre" type="text" required
              class="w-full px-4 py-3 rounded-lg border border-whatsapp-light-gray focus:ring-2 focus:ring-whatsapp-medium-blue focus:border-transparent transition-all duration-200"
              placeholder="Ingresa tu nombre completo">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Apodo</label>
            <input v-model="newUser.apodo" type="text" required
              class="w-full px-4 py-3 rounded-lg border border-whatsapp-light-gray focus:ring-2 focus:ring-whatsapp-medium-blue focus:border-transparent transition-all duration-200"
              placeholder="Ingresa tu apodo">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input v-model="newUser.email" type="email" required
              @blur="validateEmail"
              :class="[
                'w-full px-4 py-3 rounded-lg border transition-all duration-200',
                emailError ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-whatsapp-light-gray focus:ring-2 focus:ring-whatsapp-medium-blue focus:border-transparent'
              ]"
              placeholder="Ingresa tu correo electrónico">
            <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input v-model="newUser.password" type="password" required
              @blur="validatePassword"
              :class="[
                'w-full px-4 py-3 rounded-lg border transition-all duration-200',
                passwordError ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-whatsapp-light-gray focus:ring-2 focus:ring-whatsapp-medium-blue focus:border-transparent'
              ]"
              placeholder="Crea una contraseña">
            <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
            <div class="mt-2 text-xs">
              <p class="text-gray-600 mb-2">La contraseña debe contener:</p>
              <ul class="space-y-1">
                <li :class="[
                  'flex items-center space-x-2',
                  passwordRequirements.length ? 'text-green-600' : 'text-gray-500'
                ]">
                  <span :class="[
                    'w-4 h-4 rounded-full flex items-center justify-center text-xs',
                    passwordRequirements.length ? 'bg-green-500 text-white' : 'bg-gray-300'
                  ]">✓</span>
                  <span>Al menos 8 caracteres</span>
                </li>
                <li :class="[
                  'flex items-center space-x-2',
                  passwordRequirements.hasUpper ? 'text-green-600' : 'text-gray-500'
                ]">
                  <span :class="[
                    'w-4 h-4 rounded-full flex items-center justify-center text-xs',
                    passwordRequirements.hasUpper ? 'bg-green-500 text-white' : 'bg-gray-300'
                  ]">✓</span>
                  <span>Una letra mayúscula</span>
                </li>
                <li :class="[
                  'flex items-center space-x-2',
                  passwordRequirements.hasLower ? 'text-green-600' : 'text-gray-500'
                ]">
                  <span :class="[
                    'w-4 h-4 rounded-full flex items-center justify-center text-xs',
                    passwordRequirements.hasLower ? 'bg-green-500 text-white' : 'bg-gray-300'
                  ]">✓</span>
                  <span>Una letra minúscula</span>
                </li>
                <li :class="[
                  'flex items-center space-x-2',
                  passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'
                ]">
                  <span :class="[
                    'w-4 h-4 rounded-full flex items-center justify-center text-xs',
                    passwordRequirements.hasNumber ? 'bg-green-500 text-white' : 'bg-gray-300'
                  ]">✓</span>
                  <span>Un número</span>
                </li>
                <li :class="[
                  'flex items-center space-x-2',
                  passwordRequirements.hasSpecial ? 'text-green-600' : 'text-gray-500'
                ]">
                  <span :class="[
                    'w-4 h-4 rounded-full flex items-center justify-center text-xs',
                    passwordRequirements.hasSpecial ? 'bg-green-500 text-white' : 'bg-gray-300'
                  ]">✓</span>
                  <span>Un carácter especial</span>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
            <input v-model="confirmPassword" type="password" required
              @blur="validateConfirmPassword"
              :class="[
                'w-full px-4 py-3 rounded-lg border transition-all duration-200',
                confirmPasswordError ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-whatsapp-light-gray focus:ring-2 focus:ring-whatsapp-medium-blue focus:border-transparent'
              ]"
              placeholder="Confirma tu contraseña">
            <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">{{ confirmPasswordError }}</p>
          </div>
        </div>

        <button type="submit"
          class="w-full py-3 bg-gradient-to-r from-whatsapp-dark-blue to-whatsapp-sky-blue text-white rounded-lg font-semibold hover:from-whatsapp-sky-blue hover:to-whatsapp-dark-blue transition-all duration-300 transform hover:scale-105 shadow-lg">
          Crear cuenta
        </button>
      </form>

      <div class="text-center mt-6">
        <p class="text-whatsapp-gray">
          Ya tienes una cuenta?
          <RouterLink :to="{ name: 'Login' }"
            class="text-whatsapp-medium-blue hover:text-whatsapp-dark-blue font-semibold transition-colors duration-200">
            Iniciar sesión
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import { isValidEmail } from '@/utils/emailValidation'
import { validatePasswordStrength, getPasswordRequirements } from '@/utils/passwordValidation'
import { validateRegisterForm } from '@/utils/formValidation'

const userStore = useUserStore()
const { newUser } = storeToRefs(userStore)
const confirmPassword = ref('')
const router = useRouter()

// Estados para validación
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// Función para validar email en tiempo real
const validateEmail = () => {
  if (newUser.value.email && !isValidEmail(newUser.value.email)) {
    emailError.value = "Por favor ingresa un email válido"
  } else {
    emailError.value = ""
  }
}

// Función para validar contraseña en tiempo real
const validatePassword = () => {
  if (newUser.value.password) {
    const error = validatePasswordStrength(newUser.value.password)
    passwordError.value = error || ""
  } else {
    passwordError.value = ""
  }
}

// Función para validar confirmación de contraseña
const validateConfirmPassword = () => {
  if (confirmPassword.value && confirmPassword.value !== newUser.value.password) {
    confirmPasswordError.value = "Las contraseñas no coinciden"
  } else {
    confirmPasswordError.value = ""
  }
}

// Computed para mostrar el estado de los requisitos de contraseña
const passwordRequirements = computed(() => getPasswordRequirements(newUser.value.password))

const handleSubmit = async () => {
  // Validar campos básicos
  if (!newUser.value.nombre?.trim() || !newUser.value.apodo?.trim()) {
    return
  }

  // Usar la función utilitaria para validar el formulario
  const { errors, hasErrors } = validateRegisterForm(newUser.value, confirmPassword.value)
  
  // Asignar errores a las variables reactivas
  emailError.value = errors.emailError
  passwordError.value = errors.passwordError
  confirmPasswordError.value = errors.confirmPasswordError

  // Si no hay errores, proceder con el registro
  if (!hasErrors) {
    const response = await userStore.register()
    if (response) {
      router.replace({ name: 'Login' })
    }
  }
}
</script>