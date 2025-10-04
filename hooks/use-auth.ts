
// 'use client'

// import { useState, useEffect, useCallback  } from 'react'
// import { User } from '@supabase/supabase-js'
// import { authService } from '@/lib/auth'

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null)
//   const [userId, setUserId] = useState<string | null>(null) // 👈 add this
//   const [loading, setLoading] = useState(true)

//   // Function to refresh current user
//   // const refreshUser = async () => {
//   //   setLoading(true)
//   //   const { user, userId } = await authService.getCurrentUser()
//   //   setUser(user ?? null)
//   //   setUserId(userId ?? null)
//   //   setLoading(false)
//   // }
//   // --- Refresh user state manually ---
//   const refreshUser = useCallback(async () => {
//     setLoading(true)
//     try {
//       const { user, userId } = await authService.getCurrentUser()
//       setUser(user ?? null)
//       setUserId(userId ?? null)
//     } catch (err) {
//       console.error('Error refreshing user:', err)
//       setUser(null)
//       setUserId(null)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     // Get initial user
//     refreshUser()

//     // Listen for auth changes
//     const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
//       if(event === 'SIGNED_OUT') {
//       setUser(null)
//       setUserId(null)
//     } else {
//       setUser(session?.user ?? null)
//       setUserId(session?.user?.id ?? null)
//     }
//       setLoading(false)
//     })

//     return () => subscription.unsubscribe()
//   }, [refreshUser])

//   return { user, userId, loading, refreshUser } // 👈 include userId and refreshUser
// }


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
    refreshUser();
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserId(null);
        router.replace('/auth'); // 🔥 Critical: redirect on sign out
      } else {
        setUser(session?.user ?? null);
        setUserId(session?.user?.id ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshUser, router]);

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
