
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

// import { supabase } from './supabase'
// import { AuthError, User } from '@supabase/supabase-js'

// export interface AuthResult {
//   user?: User | null
//   error?: AuthError | null
// }

// export const authService = {
//   async signUp(email: string, password: string, username: string): Promise<AuthResult> {
//     // Add username + full_name → visible in Supabase dashboard
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           username,
//           full_name: username, // 👈 Supabase Auth "Display Name"
//         },
//       },
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

//     // 👇 Hard redirect to login page after logout
//     if (!error && typeof window !== 'undefined') {
//       window.location.href = '/auth'
//     }

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
//   },
// }


import { supabase } from './supabase'
import { AuthError, User } from '@supabase/supabase-js'

export interface AuthResult {
  user?: User | null
  userId?: string | null   // 👈 added userId field
  error?: AuthError | null
}

export const authService = {
  // --- Sign Up
  async signUp(email: string, password: string, username: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: username, // 👈 saved in Supabase user_metadata
        },
      },
    })

    return { 
      user: data.user, 
      userId: data.user?.id ?? null, // 👈 return userId
      error 
    }
  },

  // --- Sign In
  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { 
      user: data.user, 
      userId: data.user?.id ?? null, 
      error 
    }
  },

  // --- Sign Out
  async signOut() {
    const { error } = await supabase.auth.signOut()

    if (!error && typeof window !== 'undefined') {
      window.location.href = '/auth'
    }

    return { error }
  },

  // --- Reset Password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  },

  // --- Update Password
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    return { error }
  },

  // --- Get Current User
  async getCurrentUser(): Promise<AuthResult> {
    const { data, error } = await supabase.auth.getUser()

    return { 
      user: data.user, 
      userId: data.user?.id ?? null, 
      error 
    }
  },

  // --- Auth State Change
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
