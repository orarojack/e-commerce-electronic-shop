"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { dbHelpers } from "./supabase"
import { toast } from "sonner"

interface StoreSettings {
  storeName: string
  storeDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  website: string
  currency: string
  taxRate: string
  shippingCost: string
  freeShippingThreshold: string
  maintenanceMode: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  whatsappNotifications: boolean
  orderConfirmationEmail: boolean
  lowStockAlerts: boolean
  newOrderAlerts: boolean
}

interface SettingsContextType {
  settings: StoreSettings
  loading: boolean
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>
  refreshSettings: () => Promise<void>
}

const defaultSettings: StoreSettings = {
  storeName: "Mash Electronics",
  storeDescription: "Your trusted source for quality electronics in Kenya",
  contactEmail: "info@mashelectronics.co.ke",
  contactPhone: "+254700123456",
  address: "Nairobi, Kenya",
  website: "https://mashelectronics.co.ke",
  currency: "KSH",
  taxRate: "16",
  shippingCost: "0",
  freeShippingThreshold: "5000",
  maintenanceMode: false,
  emailNotifications: true,
  smsNotifications: true,
  whatsappNotifications: true,
  orderConfirmationEmail: true,
  lowStockAlerts: true,
  newOrderAlerts: true
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  const loadSettings = async () => {
    try {
      setLoading(true)
      const settingsData = await dbHelpers.getStoreSettings()
      if (settingsData) {
        setSettings(settingsData)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      // Keep using default settings if loading fails
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      await dbHelpers.updateStoreSettings(updatedSettings)
      setSettings(updatedSettings)
      toast.success("Settings updated successfully!")
    } catch (error) {
      console.error("Failed to update settings:", error)
      toast.error("Failed to update settings")
      throw error
    }
  }

  const refreshSettings = async () => {
    await loadSettings()
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      updateSettings,
      refreshSettings
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
} 