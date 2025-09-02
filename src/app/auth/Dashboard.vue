<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
    <!-- Sidebar for Filters/Actions -->
    <div
      class="w-64 bg-surface-100 dark:bg-surface-900 p-4 border-r border-surface-200 dark:border-surface-800 hidden lg:block">
      <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">Filtros</h2>
      <div class="space-y-4">
        <div>
          <label for="status-filter" class="block text-sm font-medium text-surface-700 dark:text-surface-300">
            Status
          </label>
          <Select id="status-filter" v-model="statusFilter" :options="statusOptions" option-label="label"
            option-value="value" placeholder="Filtrar por status" class="w-full mt-1" />
        </div>
        <Button label="Limpar Filtros" icon="pi pi-times" class="w-full" severity="secondary" @click="clearFilters" />
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex flex-col p-4  w-full ">
      <div class="flex justify-between items-center mb-6 p-2 ">
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50">Minhas Empresas</h1>
        <Button label="Atualizar" icon="pi pi-refresh" class="p-button-sm" @click="fetchTenants" :loading="loading" />
      </div>
      <div class="flex w-full ">
        <!-- Skeleton Loader -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          <Skeleton v-for="i in 6" :key="i" class="h-40 rounded-lg" />
        </div>
        <!-- Tenant Grid -->
        <!-- Tenant Grid -->
        <div v-else-if="filteredTenants.length" class="grid gap-6 p-6 w-full
         grid-cols-1
         sm:grid-cols-2
         md:grid-cols-3
         lg:grid-cols-3
         xl:grid-cols-4
         2xl:grid-cols-5">

          <Card v-for="tenant in filteredTenants" :key="tenant.id" class="group cursor-pointer transition-all duration-300
           bg-surface-0 dark:bg-surface-800 
           rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col">

            <!-- Header -->
            <template #header>
              <div class="h-16 bg-gradient-to-r from-indigo-500 to-indigo-700
                  dark:from-surface-900 dark:to-surface-950
                  flex items-center justify-center">
                <span class="text-lg font-bold text-white tracking-wide group-hover:scale-105 transition-transform">
                  {{ tenant.tenants.name }}
                </span>
              </div>
            </template>

            <!-- Content -->
            <template #content>
              <div class="space-y-3 p-4">
                <p class="text-surface-700 dark:text-surface-300 text-sm">
                  <strong>Código:</strong> {{ tenant.tenants.code }}
                </p>

                <p class="text-surface-700 dark:text-surface-300 text-sm">
                  <strong>Status: </strong>
                  <span :class="tenant.tenants.status === 'active'
                    ? 'text-green-500 font-semibold'
                    : 'text-red-500 font-semibold'">
                    {{ tenant.tenants.status }}
                  </span>
                </p>

                <p class="text-surface-700 dark:text-surface-300 text-sm">
                  <strong>Função:</strong> {{ tenant.role }}
                </p>
              </div>
            </template>


            <!-- Footer -->
            <template #footer>
              <div class="p-4 w-full">
                <button type="button" @click="openConfirmModal(tenant.tenants)" class="w-full py-2 px-4 text-sm font-semibold tracking-wide
             rounded-xl transition-all duration-300
             text-white shadow-md
             bg-gradient-to-r from-indigo-500 to-indigo-700
             hover:from-indigo-600 hover:to-indigo-800
             focus:outline-none focus:ring-2 focus:ring-offset-2
             focus:ring-indigo-500
             dark:from-surface-800 dark:to-surface-900
             dark:hover:from-[#22223b] dark:hover:to-[#4361ee]">
                  <i class="pi pi-check mr-2"></i> Selecionar
                </button>
              </div>
            </template>

          </Card>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-surface-700 dark:text-surface-300 text-lg">Nenhum tenant encontrado.</p>
          <Button label="Tentar novamente" icon="pi pi-refresh" class="mt-4" @click="fetchTenants" />
        </div>
      </div>
    </div>
    <!-- Confirmation Modal -->
    <Dialog v-model:visible="showConfirmModal" header="Confirmar Seleção" :modal="true" :style="{ width: '30rem' }">
      <p class="text-surface-700 dark:text-surface-300">
        Deseja selecionar o tenant <strong>{{ selectedTenant?.name }}</strong> (Código:
        {{ selectedTenant?.code }})?
      </p>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showConfirmModal = false" />
        <Button label="Confirmar" icon="pi pi-check" class="p-button-success" @click="confirmTenantSelection"
          :loading="selecting" />
      </template>
    </Dialog>
    <Toast />

  </div>
</template>

<script setup>
  import Button from 'primevue/button';
  import Card from 'primevue/card';
  import Dialog from 'primevue/dialog';
  import Select from 'primevue/select';
  import Skeleton from 'primevue/skeleton';
  import Toast from 'primevue/toast';
  import { useToast } from 'primevue/usetoast';
  import { computed, onMounted, ref } from 'vue';
  import { supabase } from '../services/supabase';
  import { useAuthStore } from '../stores/auth';

  // State
  const tenants = ref([]);
  const loading = ref(false);
  const statusFilter = ref('');
  const showConfirmModal = ref(false);
  const selectedTenant = ref(null);
  const selecting = ref(false);
  const toast = useToast();
  const authStore = useAuthStore();

  // Filter options
  const statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Ativo', value: 'active' },
    { label: 'Inativo', value: 'inactive' },
  ];

  // Computed properties
  const filteredTenants = computed(() => {
    if (!statusFilter.value) return tenants.value;
    return tenants.value.filter((tenant) => tenant.tenants.status === statusFilter.value);
  });

  // Fetch tenants
  async function fetchTenants() {
    loading.value = true;
    try {
      const { data, error } = await supabase.from('user_tenants').select('*, tenants(code,name,status)');
      if (error) throw new Error(error.message);
      tenants.value = data || [];
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro ao carregar tenants',
        detail: error.message || 'Não foi possível carregar os tenants.',
        life: 3000,
      });
    } finally {
      loading.value = false;
    }
  }

  // Open confirmation modal
  function openConfirmModal(tenant) {
    selectedTenant.value = tenant;
    showConfirmModal.value = true;
  }

  // Confirm tenant selection
  async function confirmTenantSelection() {
    if (!selectedTenant.value) return;
    selecting.value = true;
    try {
      await authStore.setTenant(selectedTenant.value.code);
      toast.add({
        severity: 'success',
        summary: 'Tenant Selecionado',
        detail: `Tenant ${selectedTenant.value.code} foi selecionado com sucesso.`,
        life: 3000,
      });
      showConfirmModal.value = false;
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro ao selecionar tenant',
        detail: error.message || 'Não foi possível selecionar o tenant.',
        life: 3000,
      });
    } finally {
      selecting.value = false;
    }
  }

  // Clear filters
  function clearFilters() {
    statusFilter.value = '';
    toast.add({
      severity: 'info',
      summary: 'Filtros Limpos',
      detail: 'Os filtros foram redefinidos.',
      life: 3000,
    });
  }

  // Initialize
  onMounted(() => {
    fetchTenants();
  });
</script>

<style lang="scss" scoped>
  /* Additional scoped styles if needed */
</style>
