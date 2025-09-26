
// import { supabase } from './supabase'
// import { AuthError, User } from '@supabase/supabase-js'

// export interface AuthResult {
//   user?: User | null
//   error?: AuthError | null
// }

// export const authService = {
//   async signUp(email: string, password: string, username: string): Promise<AuthResult> {
//     // Add username to user metadata
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: { username }
//       }
//     })
//     return { user: data.user, error }
//   },

//   async signIn(email: string, password: string): Promise<AuthResult> {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//     return { user: data.user, error }
//   },

//   async signOut() {
//     const { error } = await supabase.auth.signOut()
//     return { error }
//   },

//   async resetPassword(email: string) {
//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/auth/reset-password`,
//     })
//     return { error }
//   },

//   async updatePassword(password: string) {
//     const { error } = await supabase.auth.updateUser({ password })
//     return { error }
//   },

//   getCurrentUser() {
//     return supabase.auth.getUser()
//   },

//   onAuthStateChange(callback: (event: string, session: any) => void) {
//     return supabase.auth.onAuthStateChange(callback)
//   }
// }

import { supabase } from './supabase'
import { AuthError, User } from '@supabase/supabase-js'

export interface AuthResult {
  user?: User | null
  error?: AuthError | null
}

export const authService = {
  async signUp(email: string, password: string, username: string): Promise<AuthResult> {
    // Add username + full_name → visible in Supabase dashboard
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: username, // 👈 Supabase Auth "Display Name"
        },
      },
    })
    return { user: data.user, error }
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { user: data.user, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()

    // 👇 Hard redirect to login page after logout
    if (!error && typeof window !== 'undefined') {
      window.location.href = '/auth'
    }

    return { error }
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  },

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    return { error }
  },

  getCurrentUser() {
    return supabase.auth.getUser()
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
