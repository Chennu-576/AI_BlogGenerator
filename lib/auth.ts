
// import { supabase } from './supabase'
// import { AuthError, User } from '@supabase/supabase-js'

// export interface AuthResult {
//   user?: User | null
//   userId?: string | null   // 👈 added userId field
//   error?: AuthError | null
// }

// export const authService = {
//   // --- Sign Up
//   async signUp(email: string, password: string, username: string): Promise<AuthResult> {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           username,
//           full_name: username, // 👈 saved in Supabase user_metadata
//         },
//       },
//     })

//     return { 
//       user: data.user, 
//       userId: data.user?.id ?? null, // 👈 return userId
//       error 
//     }
//   },

//   // --- Sign In
//   async signIn(email: string, password: string): Promise<AuthResult> {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })

//     return { 
//       user: data.user, 
//       userId: data.user?.id ?? null, 
//       error 
//     }
//   },

//   // --- Sign Out
//   async signOut(router: any) {
//     const { error } = await supabase.auth.signOut()

//     if (!error && router) {
//       router.push('/auth') // Use Next.js router for navigation
//     }

//     return { error }
//   },

//   // --- Reset Password
//   async resetPassword(email: string) {
//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/auth/reset-password`,
//     })
//     return { error }
//   },

//   // --- Update Password
//   async updatePassword(password: string) {
//     const { error } = await supabase.auth.updateUser({ password })
//     return { error }
//   },

//   // --- Get Current User
//   async getCurrentUser(): Promise<AuthResult> {
//     const { data, error } = await supabase.auth.getUser()

//     return { 
//       user: data.user, 
//       userId: data.user?.id ?? null, 
//       error 
//     }
//   },

//   // --- Auth State Change
//   onAuthStateChange(callback: (event: string, session: any) => void) {
//     return supabase.auth.onAuthStateChange(callback)
//   },
// }

import { supabase } from './supabase';
import { AuthError, User } from '@supabase/supabase-js';

export interface AuthResult {
  user?: User | null;
  userId?: string | null;
  error?: AuthError | null;
}

export const authService = {
  async signUp(email: string, password: string, username: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: username,
        },
      },
    });

    return {
      user: data.user,
      userId: data.user?.id ?? null,
      error,
    };
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data.user,
      userId: data.user?.id ?? null,
      error,
    };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
      if (error) console.error('Sign out error:', error);
    return { error };
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`, // Change if needed
    });

    return { error };
  },

  async getCurrentUser(): Promise<AuthResult> {
    const { data, error } = await supabase.auth.getUser();

    return {
      user: data.user,
      userId: data.user?.id ?? null,
      error,
    };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
