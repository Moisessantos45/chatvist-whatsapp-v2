import { isValidEmail } from './emailValidation'
import { validatePasswordStrength } from './passwordValidation'

/**
 * Interface para errores de validación del formulario de registro
 */
export interface RegisterValidationErrors {
  emailError: string
  passwordError: string
  confirmPasswordError: string
}

/**
 * Interface para los datos del usuario de registro
 */
export interface RegisterUserData {
  nombre: string
  apodo: string
  email: string
  password: string
}

/**
 * Valida todos los campos del formulario de registro
 * @param userData - Datos del usuario
 * @param confirmPassword - Confirmación de contraseña
 * @returns Objeto con errores de validación y boolean indicando si hay errores
 */
export const validateRegisterForm = (
  userData: RegisterUserData, 
  confirmPassword: string
): { errors: RegisterValidationErrors; hasErrors: boolean } => {
  const errors: RegisterValidationErrors = {
    emailError: '',
    passwordError: '',
    confirmPasswordError: ''
  }

  let hasErrors = false

  // Validar email
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.emailError = "Por favor ingresa un email válido"
    hasErrors = true
  }

  // Validar contraseña
  if (!userData.password) {
    errors.passwordError = "La contraseña es requerida"
    hasErrors = true
  } else {
    const passwordValidationError = validatePasswordStrength(userData.password)
    if (passwordValidationError) {
      errors.passwordError = passwordValidationError
      hasErrors = true
    }
  }

  // Validar confirmación de contraseña
  if (!confirmPassword) {
    errors.confirmPasswordError = "La confirmación de contraseña es requerida"
    hasErrors = true
  } else if (confirmPassword !== userData.password) {
    errors.confirmPasswordError = "Las contraseñas no coinciden"
    hasErrors = true
  }

  return { errors, hasErrors }
}