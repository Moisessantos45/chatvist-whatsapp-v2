/**
 * Interface para los requisitos de contraseña
 */
export interface PasswordRequirements {
  length: boolean
  hasUpper: boolean
  hasLower: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

/**
 * Valida la fortaleza de la contraseña y retorna un mensaje de error o null
 * @param password - La contraseña a validar
 * @returns string con el mensaje de error o null si es válida
 */
export const validatePasswordStrength = (password: string): string | null => {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres"
  }

  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  if (!hasUpper) {
    return "La contraseña debe contener al menos una letra mayúscula"
  }
  if (!hasLower) {
    return "La contraseña debe contener al menos una letra minúscula"
  }
  if (!hasNumber) {
    return "La contraseña debe contener al menos un número"
  }
  if (!hasSpecial) {
    return "La contraseña debe contener al menos un carácter especial"
  }

  return null
}

/**
 * Obtiene el estado de todos los requisitos de contraseña
 * @param password - La contraseña a evaluar
 * @returns Objeto con el estado de cada requisito
 */
export const getPasswordRequirements = (password: string): PasswordRequirements => {
  return {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }
}