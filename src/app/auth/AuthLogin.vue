<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
    <Card class="w-full max-w-md p-8 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-lg">
      <template #content>
        <h2 class="text-3xl font-bold mb-8 text-surface-900 dark:text-surface-50 text-center">Bem-vindo</h2>
        <div class="flex flex-col gap-6">
          <div>
            <label for="email"
              class="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-200">Email</label>
            <InputText id="email" v-model="email" type="email"
              class="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="Digite seu email" />
          </div>
          <div>
            <label for="password"
              class="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-200">Senha</label>
            <InputText id="password" v-model="password" type="password"
              class="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="Digite sua senha" />
          </div>
          <Button label="Entrar" @click="login" :loading="loading"
            class="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors" />
          <Button label="Entrar com Google" icon="pi pi-google" @click="loginWithGoogle" :loading="loading"
            class="w-full p-3 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-900 dark:text-surface-50 rounded-lg font-medium transition-colors"
            outlined />
          <div class="flex justify-between text-sm">
            <router-link to="/reset-password" class="text-green-500 hover:underline">Esqueceu a senha?</router-link>
            <router-link to="/register" class="text-green-500 hover:underline">Criar conta</router-link>
          </div>
        </div>
      </template>
    </Card>
    <Toast />
  </div>
</template>

<script setup>
  import { useAuth } from '@/app/services/useSupabase';
  // import { useAuthStore } from '@/stores/auth';
  import Button from 'primevue/button';
  import Card from 'primevue/card';
  import InputText from 'primevue/inputtext';
  import Toast from 'primevue/toast';
  import { useToast } from 'primevue/usetoast';
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const router = useRouter();
  const toast = useToast();
  const { signIn, signInWithOAuth, isAuthenticated } = useAuth();
  // const authStore = useAuthStore();

  // Helper function to show Toast messages
  function showToast(severity, summary, detail, life = 3000) {
    toast.add({ severity, summary, detail, life });
  }

  onMounted(async () => {
    // try {
    //   await authStore.setUser();
    //   if (authStore.user) {
    //     showToast('success', 'Bem-vindo!', 'Você já está logado.', 2000);
    //     router.push('/profile');
    //   }
    // } catch (err) {
    //   showToast('error', 'Erro', 'Falha ao verificar sessão. Tente novamente.', 4000);
    // }
  });

  async function login() {
    if (!email.value || !password.value) {
      showToast('warn', 'Campos obrigatórios', 'Por favor, preencha email e senha.');
      return;
    }

    loading.value = true;
    try {
      const { error: authError } = await signIn({ email: email.value, password: password.value });
      if (authError) {
        let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
        if (authError.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (authError.message.includes('network') || authError.message.includes('Failed to fetch')) {
          errorMessage = 'Sistema offline. Verifique sua conexão.';
        } else if (authError.status === 503) {
          errorMessage = 'Servidor em manutenção. Tente novamente mais tarde.';
        }
        showToast('error', 'Erro', errorMessage, 4000);
      } else {
        // await authStore.setUser();
        showToast('success', 'Sucesso', 'Login realizado com sucesso!', 2000);
        router.push('/profile');
      }
    } catch (err) {
      showToast('error', 'Erro', 'Falha inesperada ao fazer login. Tente novamente.', 4000);
    } finally {
      loading.value = false;
    }
  }

  async function loginWithGoogle() {
    loading.value = true;
    try {
      const { error: authError } = await signInWithOAuth({ provider: 'google' });
      if (authError) {
        let errorMessage = 'Erro ao fazer login com Google.';
        if (authError.message.includes('network') || authError.message.includes('Failed to fetch')) {
          errorMessage = 'Sistema offline. Verifique sua conexão.';
        } else if (authError.status === 503) {
          errorMessage = 'Servidor em manutenção. Tente novamente mais tarde.';
        }
        showToast('error', 'Erro', errorMessage, 4000);
      } else {
        showToast('success', 'Sucesso', 'Login com Google realizado com sucesso!', 2000);
        router.push('/profile');
      }
    } catch (err) {
      showToast('error', 'Erro', 'Falha inesperada ao fazer login com Google.', 4000);
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="scss" scoped>
  .card {
    transition: all 0.3s ease-in-out;
  }
</style>