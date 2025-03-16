'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAccessToken, setIsInitialized } = useAuthStore()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await fetch('/api/auth/token')
        if (response.ok) {
          const { accessToken } = await response.json()
          setAccessToken(accessToken)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [setAccessToken, setIsInitialized])

  return <>{children}</>
} 