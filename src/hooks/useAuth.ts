import { useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts';

export type AuthMode = 'authenticated' | 'anonymous' | 'loading';

interface AuthState {
  user: User | null;
  session: Session | null;
  mode: AuthMode;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    mode: isSupabaseConfigured ? 'loading' : 'anonymous',
    loading: isSupabaseConfigured,
    error: null,
  });

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setState({
          user: session.user,
          session,
          mode: 'authenticated',
          loading: false,
          error: null,
        });
      } else {
        setState(s => ({
          ...s,
          mode: localStorage.getItem('pi-auth-skipped') ? 'anonymous' : 'loading',
          loading: false,
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        mode: session ? 'authenticated' : 'anonymous',
        loading: false,
        error: null,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    if (!supabase) return;
    setState(s => ({ ...s, loading: true, error: null }));
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setState(s => ({ ...s, loading: false, error: error.message }));
    } else {
      setState(s => ({ ...s, loading: false, error: null }));
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    setState(s => ({ ...s, loading: true, error: null }));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setState(s => ({ ...s, loading: false, error: error.message }));
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    localStorage.removeItem('pi-auth-skipped');
    setState({ user: null, session: null, mode: 'anonymous', loading: false, error: null });
  }, []);

  const skipAuth = useCallback(() => {
    localStorage.setItem('pi-auth-skipped', 'true');
    setState(s => ({ ...s, mode: 'anonymous', loading: false }));
  }, []);

  return {
    ...state,
    signInWithMagicLink,
    signInWithGoogle,
    signOut,
    skipAuth,
    isConfigured: isSupabaseConfigured,
  } as const;
}
