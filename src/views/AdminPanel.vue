<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <!-- Top Navigation -->
        <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center gap-3">
                        <button @click="goBack"
                            class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
                            <ArrowLeft class="w-5 h-5 text-gray-600" />
                        </button>
                        <div class="flex items-center gap-2">
                            <div
                                class="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                                <Shield class="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 class="text-lg font-bold text-gray-800 leading-tight">Panel de Administración</h1>
                                <p class="text-xs text-gray-400">Gestión de usuarios y grupos</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button @click="showCreateGroup = true"
                            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
                            <FolderPlus class="w-4 h-4" />
                            <span class="hidden sm:inline">Crear Grupo</span>
                        </button>
                        <button @click="showRegisterAI = true"
                            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
                            <Bot class="w-4 h-4" />
                            <span class="hidden sm:inline">Registrar IA</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Users class="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-800">{{ adminStore.users.length }}</p>
                            <p class="text-xs text-gray-400">Usuarios</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <UserCheck class="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-800">{{ activeUsersCount }}</p>
                            <p class="text-xs text-gray-400">Activos</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                            <Bot class="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-800">{{ aiUsersCount }}</p>
                            <p class="text-xs text-gray-400">IAs</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <FolderClosed class="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-800">{{ adminStore.groups.length }}</p>
                            <p class="text-xs text-gray-400">Grupos</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="flex border-b border-gray-100">
                    <button @click="activeTab = 'users'"
                        class="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors duration-150 cursor-pointer"
                        :class="activeTab === 'users'
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
                        <Users class="w-4 h-4" />
                        Usuarios
                    </button>
                    <button @click="activeTab = 'groups'"
                        class="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors duration-150 cursor-pointer"
                        :class="activeTab === 'groups'
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
                        <FolderClosed class="w-4 h-4" />
                        Grupos
                    </button>
                </div>

                <!-- Loading State -->
                <div v-if="adminStore.loading" class="py-16 text-center">
                    <Loader2 class="w-8 h-8 mx-auto mb-3 text-blue-500 animate-spin" />
                    <p class="text-sm text-gray-400">Cargando datos...</p>
                </div>

                <!-- Tab Content -->
                <div v-else>
                    <UserTable v-if="activeTab === 'users'" :users="adminStore.users" @deactivate="handleDeactivate"
                        @remove-sessions="handleRemoveSessions" @assign-group="openAssignGroupModal" />
                    <GroupTable v-if="activeTab === 'groups'" :groups="adminStore.groups" />
                </div>
            </div>
        </main>

        <!-- Modals -->
        <RegisterAIModal v-if="showRegisterAI" @close="showRegisterAI = false" />
        <CreateGroupModal v-if="showCreateGroup" @close="showCreateGroup = false" />
        <AssignGroupModal v-if="assignGroupUserId !== null" :userId="assignGroupUserId" :groups="adminStore.groups"
            @close="assignGroupUserId = null" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Shield, Bot, Users, UserCheck, FolderClosed, FolderPlus, Loader2 } from 'lucide-vue-next'
import useAdminStore from '@/stores/admin'
import UserTable from '@/components/admin/UserTable.vue'
import GroupTable from '@/components/admin/GroupTable.vue'
import RegisterAIModal from '@/components/admin/RegisterAIModal.vue'
import CreateGroupModal from '@/components/admin/CreateGroupModal.vue'
import AssignGroupModal from '@/components/admin/AssignGroupModal.vue'

const router = useRouter()
const adminStore = useAdminStore()

const activeTab = ref<'users' | 'groups'>('users')
const showRegisterAI = ref(false)
const showCreateGroup = ref(false)
const assignGroupUserId = ref<number | null>(null)

const activeUsersCount = computed(() => adminStore.users.filter(u => u.isActive).length)
const aiUsersCount = computed(() => adminStore.users.filter(u => u.isLlm).length)

const goBack = () => {
    router.push({ name: 'Dashboard' })
}

const handleDeactivate = async (userId: number) => {
    await adminStore.deactivateUser(userId)
}

const handleRemoveSessions = async (userId: number) => {
    await adminStore.removeSessions(userId)
}

const openAssignGroupModal = (userId: number) => {
    assignGroupUserId.value = userId
}

onMounted(async () => {
    await Promise.all([adminStore.fetchUsers(), adminStore.fetchGroups()])
})
</script>
