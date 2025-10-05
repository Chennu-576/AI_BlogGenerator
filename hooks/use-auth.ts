
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const { user, userId } = await authService.getCurrentUser();
      setUser(user ?? null);
      setUserId(userId ?? null);
    } catch(err) {
      setUser(null);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        if (mounted) {
          setUser(user ?? null);
          setUserId(user?.id ?? null);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setUser(null);
          setUserId(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null);
          setUserId(session?.user?.id ?? null);
          if (event === 'SIGNED_IN') {
            router.push('/dashboard');
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserId(null);
          router.push('/auth');
        } else if (event === 'USER_UPDATED') {
          setUser(session?.user ?? null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const signup = useCallback(async ({ email, password, username }: { email: string; password: string; username: string }) => {
    return await authService.signUp(email, password, username);
  }, []);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    return await authService.signIn(email, password);
  }, []);

  const resetPassword = useCallback(async ({ email }: { email: string }) => {
    return await authService.resetPassword(email);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setUserId(null);
    setLoading(false);
    console.log('Redirecting to /auth');
    router.replace('/auth');
  }, [router]);

  return {
    user,
    userId,
    loading,
    refreshUser,
    signup,
    login,
    resetPassword,
    logout,
  };
}
