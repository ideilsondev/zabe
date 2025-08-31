import { supabase } from '@/app/services/supabase'
import { computed, onUnmounted, ref } from 'vue'

export function useSupabase() {
  return {
    client: supabase
  }
}

export function useAuth() {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  const initializeAuth = async () => {
    try {
      loading.value = true
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError
      session.value = currentSession
      user.value = currentSession?.user || null

    } catch (err) {
      error.value = err
      console.error('Auth initialization error:', err.message)
    } finally {
      loading.value = false
    }
  }

  // Listen to auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, newSession) => {
      session.value = newSession
      user.value = newSession?.user || null
      loading.value = false

      if (event === 'SIGNED_OUT') {
        error.value = null
      }
    }
  )

  onUnmounted(() => {
    subscription?.unsubscribe()
  })

  const signOut = async () => {
    try {
      loading.value = true
      error.value = null
      const { error: signOutError } = await supabase.auth.signInWithPassword()
      if (signOutError) throw signOutError
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const signIn = async (credentials) => {
    try {
      loading.value = true
      error.value = null
      const { data, error: signInError } = await supabase.auth.signInWithPassword(credentials)
      if (signInError) throw signInError
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // Initialize on first use
  initializeAuth()

  return {
    user: computed(() => user.value),
    isAuthenticated,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    signOut,
    signIn
  }
}