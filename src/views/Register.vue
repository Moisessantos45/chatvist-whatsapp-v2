<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-whatsapp-dark-blue rounded-xl mx-auto mb-5 flex items-center justify-center shadow-sm">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-1.5">Crear Cuenta</h1>
        <p class="text-sm text-gray-500">Únete a WhatsApp Web hoy</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo</label>
            <input v-model="newUser.nombre" type="text" required
              class="w-full px-3.5 py-2.5 bg-gray-50/50 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-whatsapp-dark-blue/20 focus:border-whatsapp-dark-blue transition-colors duration-200 outline-none"
              placeholder="Ingresa tu nombre completo">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Apodo</label>
            <input v-model="newUser.apodo" type="text" required
              class="w-full px-3.5 py-2.5 bg-gray-50/50 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-whatsapp-dark-blue/20 focus:border-whatsapp-dark-blue transition-colors duration-200 outline-none"
              placeholder="Ingresa tu apodo">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input v-model="newUser.email" type="email" required
              @blur="validateEmail"
              :class="[
                'w-full px-3.5 py-2.5 bg-gray-50/50 rounded-lg border text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 outline-none transition-colors duration-200',
                emailError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-whatsapp-dark-blue/20 focus:border-whatsapp-dark-blue'
              ]"
              placeholder="Ingresa tu correo electrónico">
            <p v-if="emailError" class="text-red-500 text-sm mt-1.5">{{ emailError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
            <input v-model="newUser.password" type="password" required
              @blur="validatePassword"
              :class="[
                'w-full px-3.5 py-2.5 bg-gray-50/50 rounded-lg border text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 outline-none transition-colors duration-200',
                passwordError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-whatsapp-dark-blue/20 focus:border-whatsapp-dark-blue'
              ]"
              placeholder="Crea una contraseña">
            <p v-if="passwordError" class="text-red-500 text-sm mt-1.5">{{ passwordError }}</p>
            
            <div class="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600">
              <p class="font-medium mb-2">Requisitos de contraseña</p>
              <ul class="space-y-1.5">
                <li :class="[
                  'flex items-center space-x-2 transition-colors duration-200',
                  passwordRequirements.length ? 'text-green-700' : 'text-gray-500'
                ]">
                  <span :class="[
                    'w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]',
                    passwordRequirements.length ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-transparent'
                  ]">✓</span>
                  <span>Al menos 8 caracteres</span>
                </li>
                <li :class="[
                  'flex items-center space-x-2 transition-colors duration-200',
                  passwordRequirements.hasUpper ? 'text-green-700' : 'text-gray-500'
                ]">
                  <span :class="[
                    'w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]',
                    passwordRequirements.hasUpper ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-transparent'
                  ]">✓</span>
                  <span>Una letra mayúscula</span>
                </li>
                <li :class="[
                  'flex items-center space-x-2 transition-colors duration-200',
                  passwordRequirements.hasLower ? 'text-green-700' : 'text-gray-500'
                ]">
                  <span :class="[
                    'w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]',
                    passwordRequirements.hasLower ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-transparent'
                  ]">✓</span>
                  <span>Una letra minúscula</span>
                </li>
                <li :class="[
                  'flex items-center space-x-2 transition-colors duration-200',
                  passwordRequirements.hasNumber ? 'text-green-700' : 'text-gray-500'
                ]">
                  <span :class="[
                    'w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]',
                    passwordRequirements.hasNumber ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-transparent'
                  ]">✓</span>
                  <span>Un número</span>
                </li>
                <li :class="[
                  'flex items-center space-x-2 transition-colors duration-200',
                  passwordRequirements.hasSpecial ? 'text-green-700' : 'text-gray-500'
                ]">
                  <span :class="[
                    'w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]',
                    passwordRequirements.hasSpecial ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-transparent'
                  ]">✓</span>
                  <span>Un carácter especial</span>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Contraseña</label>
            <input v-model="confirmPassword" type="password" required
              @blur="validateConfirmPassword"
              :class="[
                'w-full px-3.5 py-2.5 bg-gray-50/50 rounded-lg border text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 outline-none transition-colors duration-200',
                confirmPasswordError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-whatsapp-dark-blue/20 focus:border-whatsapp-dark-blue'
              ]"
              placeholder="Confirma tu contraseña">
            <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1.5">{{ confirmPasswordError }}</p>
          </div>
        </div>

        <button type="submit"
          class="w-full py-2.5 bg-whatsapp-dark-blue hover:bg-whatsapp-dark-blue/90 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm">
          Crear cuenta
        </button>
      </form>

      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">
          ¿Ya tienes una cuenta?
          <RouterLink :to="{ name: 'Login' }"
            class="text-whatsapp-dark-blue hover:text-whatsapp-dark-blue/80 font-medium transition-colors duration-200">
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