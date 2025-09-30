// 'use client'

// import { useState, useEffect } from 'react'
// import { User } from '@supabase/supabase-js'
// import { authService } from '@/lib/auth'

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // Get initial user
//     authService.getCurrentUser().then(({ user }) => {
//       setUser(user ?? null)
//       setLoading(false)
//     })

//     // Listen for auth changes
//     const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null)
//       setLoading(false)
//     })

//     return () => subscription.unsubscribe()
//   }, [])

//   return { user, loading }
// }

'use client'

import { useState, useEffect, useCallback  } from 'react'
import { User } from '@supabase/supabase-js'
import { authService } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userId, setUserId] = useState<string | null>(null) // 👈 add this
  const [loading, setLoading] = useState(true)

  // Function to refresh current user
  // const refreshUser = async () => {
  //   setLoading(true)
  //   const { user, userId } = await authService.getCurrentUser()
  //   setUser(user ?? null)
  //   setUserId(userId ?? null)
  //   setLoading(false)
  // }
  // --- Refresh user state manually ---
  const refreshUser = useCallback(async () => {
    setLoading(true)
    try {
      const { user, userId } = await authService.getCurrentUser()
      setUser(user ?? null)
      setUserId(userId ?? null)
    } catch (err) {
      console.error('Error refreshing user:', err)
      setUser(null)
      setUserId(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Get initial user
    refreshUser()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setUserId(session?.user?.id ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [refreshUser])

  return { user, userId, loading, refreshUser } // 👈 include userId and refreshUser
}
