import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { supabase } from '../services/supabase';

// Define interfaces for type safety
const state = reactive({
  user: {},
  profile: {},
  isAuthenticated: false,
  global_tenant: null,
});

function setTenant(tenantCode) {
  if (!tenantCode) return false;
  state.global_tenant = tenantCode;
  return true;
}

// Utility function to reset state
function resetState() {
  state.isAuthenticated = false;
  state.user = {};
  state.profile = {};
}

// Set authenticated user and profile
function setAuthUser({ user = {}, profile = {}, role = '' }) {
  if (!user || !user.id) return false;
  if (!profile) return false; // Ensure profile is valid
  state.user = user;
  state.profile = profile;
  state.isAuthenticated = role === 'authenticated';
  return state.isAuthenticated;
}

// Fetch user profile from Supabase
async function getProfile(user) {
  try {
    if (!user || !user.id) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
}

// Sign in with email/password or Google OAuth
async function signIn({ email = '', password = '', google = false }) {
  try {
    if (google) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) {
        console.error('Google OAuth error:', error.message);
        return false;
      }
      // OAuth redirects, so return true to indicate initiation
      return true;
    }

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !user || user.role !== 'authenticated') {
      console.error('Sign-in error:', error?.message || 'Invalid user');
      return false;
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      console.error('Session error:', sessionError?.message);
      return false;
    }
    console.log(session);

    const profile = await getProfile(session.user);
    if (!profile) {
      console.error('Failed to fetch profile');
      return false;
    }

    return setAuthUser({ user: session.user, profile, role: user.role });
  } catch (error) {
    console.error('Unexpected sign-in error:', error);
    return false;
  }
}

// Sign out and clean up
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign-out error:', error.message);
    }
    resetState();
    window.location.href = '/';
  } catch (error) {
    console.error('Unexpected sign-out error:', error);
    resetState();
    window.location.href = '/';
  }
}

// Handle auth state changes (e.g., after OAuth redirect)
async function initializeAuth() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) {
      resetState();
      return false;
    }
    if (session.user.role === 'authenticated') {
      const profile = await getProfile(session.user);
      if (!profile) {
        resetState();
        return false;
      }
      return setAuthUser({ user: session.user, profile, role: session.user.role });
    }
    return false;
  } catch (error) {
    console.error('Error initializing auth:', error);
    resetState();
    return false;
  }
}

export const useAuthStore = defineStore('authStore', () => {
  return {
    auth: {
      user: computed(() => state.user),
      profile: computed(() => state.profile),
      isAuthenticated: computed(() => state.isAuthenticated),
      global_tenant: computed(() => state.global_tenant),
    },
    setAuthUser,
    signIn,
    signOut,
    initializeAuth,
    setTenant
  };
});