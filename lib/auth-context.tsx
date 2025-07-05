"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { dbHelpers } from "./supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "./supabase"

export type User = {
  id: string
  email: string
  full_name: string
  phone?: string
  address?: string
  role: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string, isAdmin?: boolean) => Promise<{ success: boolean; error?: string }>
  signUp: (
    userData: {
      email: string
      password: string
      full_name: string
      phone?: string
    }
  ) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("mash_user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem("mash_user")
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string, isAdmin = false) => {
    try {
      setLoading(true)

      // Get user from appropriate table
      const { data, error } = isAdmin ? await dbHelpers.getAdminByEmail(email) : await dbHelpers.getUserByEmail(email)

      if (error || !data) {
        return { success: false, error: "Invalid email or password" }
      }

      // Simple password validation (in production, use proper hashing)
      if (data.password_hash !== password) {
        return { success: false, error: "Invalid email or password" }
      }

      const userData: User = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        address: data.address,
        role: data.role,
      }

      setUser(userData)
      localStorage.setItem("mash_user", JSON.stringify(userData))

      // Redirect based on role
      if (userData.role === "admin") {
        setTimeout(() => {
          window.location.href = "/admin"
        }, 100)
      } else {
        setTimeout(() => {
          window.location.href = "/"
        }, 100)
      }

      return { success: true }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, error: "Login failed. Please try again." }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: {
    email: string
    password: string
    full_name: string
    phone?: string
  }) => {
    try {
      setLoading(true)

      // Check if user already exists
      const { data: existingUser } = await dbHelpers.getUserByEmail(userData.email)

      if (existingUser) {
        return { success: false, error: "An account with this email already exists" }
      }

      // Create new user
      const userDataCreated = await dbHelpers.createUser({
        email: userData.email,
        password_hash: userData.password, // In production, hash this properly
        full_name: userData.full_name,
        phone: userData.phone,
      })

      const newUser: User = {
        id: userDataCreated.id,
        email: userDataCreated.email,
        full_name: userDataCreated.full_name,
        phone: userDataCreated.phone,
        address: userDataCreated.address,
        role: userDataCreated.role,
      }

      setUser(newUser)
      localStorage.setItem("mash_user", JSON.stringify(newUser))

      return { success: true }
    } catch (error) {
      console.error("Sign up error:", error)
      return { success: false, error: "Registration failed. Please try again." }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    // Clear all localStorage items
    localStorage.removeItem("mash_user")
    localStorage.removeItem("cart")
    localStorage.removeItem("mash_session")
    localStorage.removeItem("mash_token")

    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname
    })

    // Clear session storage
    sessionStorage.clear()

    setUser(null)
    toast.success("Logged out successfully")

    // Force reload to clear any cached data
    setTimeout(() => {
      window.location.href = "/"
    }, 500)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("mash_user", JSON.stringify(updatedUser))
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: "Not authenticated" }

    try {
      // Verify current password
      const { data: userData, error } =
        user.role === "admin" ? await dbHelpers.getAdminByEmail(user.email) : await dbHelpers.getUserByEmail(user.email)

      if (error || !userData || userData.password_hash !== currentPassword) {
        return { success: false, error: "Current password is incorrect" }
      }

      // Update password
      const table = user.role === "admin" ? "admin_users" : "users"
      const { error: updateError } = await supabase
        .from(table)
        .update({ password_hash: newPassword, updated_at: new Date().toISOString() })
        .eq("id", user.id)

      if (updateError) throw updateError

      return { success: true }
    } catch (error) {
      console.error("Password update error:", error)
      return { success: false, error: "Failed to update password" }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
