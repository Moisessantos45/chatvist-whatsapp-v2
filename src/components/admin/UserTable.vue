<template>
    <div class="overflow-x-auto">
        <table class="w-full text-left">
            <thead>
                <tr class="border-b border-gray-200">
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Id</th>
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                    <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                        Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                <tr v-for="u in users" :key="u.id" class="hover:bg-blue-50/50 transition-colors duration-150">
                    <!-- Avatar + Nombre -->
                    <td class="py-4 px-4">{{ u.id }}</td>
                    <td class="py-4 px-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                                :class="u.isLlm ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'">
                                <Bot v-if="u.isLlm" class="w-5 h-5" />
                                <span v-else>{{ getInitials(u.nombre) }}</span>
                            </div>
                            <div class="min-w-0">
                                <p class="font-semibold text-gray-800 truncate">{{ u.nombre }}</p>
                                <p class="text-xs text-gray-400 truncate">@{{ u.apodo }}</p>
                            </div>
                        </div>
                    </td>
                    <!-- Email -->
                    <td class="py-4 px-4 text-sm text-gray-600">{{ u.email }}</td>
                    <!-- Estado -->
                    <td class="py-4 px-4">
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                            :class="u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
                            <span class="w-1.5 h-1.5 rounded-full"
                                :class="u.isActive ? 'bg-emerald-500' : 'bg-red-500'"></span>
                            {{ u.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                    </td>
                    <!-- Rol badges -->
                    <td class="py-4 px-4">
                        <div class="flex flex-wrap gap-1">
                            <span v-if="u.isAdmin"
                                class="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Admin</span>
                            <span v-if="u.isLlm"
                                class="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">IA</span>
                            <span v-if="!u.isAdmin && !u.isLlm"
                                class="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Usuario</span>
                        </div>
                    </td>
                    <!-- Acciones -->
                    <td class="py-4 px-4">
                        <div class="flex items-center justify-end gap-1">
                            <button @click="$emit('deactivate', u.id)"
                                class="p-2 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors duration-150 cursor-pointer"
                                :title="u.isActive ? 'Desactivar' : 'Activar'">
                                <UserX v-if="u.isActive" class="w-4 h-4" />
                                <UserCheck v-else class="w-4 h-4" />
                            </button>
                            <button @click="$emit('remove-sessions', u.id)"
                                class="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors duration-150 cursor-pointer"
                                title="Eliminar sesiones">
                                <KeyRound class="w-4 h-4" />
                            </button>
                            <button @click="$emit('assign-group', u.id)"
                                class="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                                title="Asignar a grupo">
                                <FolderPlus class="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="users.length === 0">
                    <td colspan="5" class="py-12 text-center text-gray-400">
                        <Users class="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p>No hay usuarios registrados</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import { Bot, UserX, UserCheck, KeyRound, FolderPlus, Users } from 'lucide-vue-next'

defineProps<{
    users: User[]
}>()

defineEmits<{
    deactivate: [userId: number]
    'remove-sessions': [userId: number]
    'assign-group': [userId: number]
}>()

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
</script>
