"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Shield, 
  Bell,
  Save,
  RefreshCw,
  CreditCard,
  Truck
} from "lucide-react"
import { useSettings } from "@/lib/settings-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AdminSettingsPage() {
  const { settings, loading, updateSettings, refreshSettings } = useSettings()
  const [saving, setSaving] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)

  // Update local settings when context settings change
  React.useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleInputChange = (field: string, value: string | boolean) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await updateSettings(localSettings)
    } catch (error) {
      // Error is already handled in the context
    } finally {
      setSaving(false)
    }
  }

  const handleResetSettings = async () => {
    try {
      await refreshSettings()
      setLocalSettings(settings)
    } catch (error) {
      // Error is already handled in the context
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Store Settings
            </h1>
            <p className="text-gray-600 mt-1">Manage your store configuration and preferences</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleResetSettings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Store Information
                </CardTitle>
                <CardDescription>Basic store details and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={localSettings.storeName}
                    onChange={(e) => handleInputChange("storeName", e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={localSettings.storeDescription}
                    onChange={(e) => handleInputChange("storeDescription", e.target.value)}
                    placeholder="Enter store description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={localSettings.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://yourstore.com"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Store contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={localSettings.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="info@yourstore.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={localSettings.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    placeholder="+254700123456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={localSettings.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Store address"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Business Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Business Settings
                </CardTitle>
                <CardDescription>Payment and business configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={localSettings.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KSH">Kenyan Shilling (KSH)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={localSettings.taxRate}
                    onChange={(e) => handleInputChange("taxRate", e.target.value)}
                    placeholder="16"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Default Shipping Cost (KSH)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    value={localSettings.shippingCost}
                    onChange={(e) => handleInputChange("shippingCost", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (KSH)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={localSettings.freeShippingThreshold}
                    onChange={(e) => handleInputChange("freeShippingThreshold", e.target.value)}
                    placeholder="5000"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  System Settings
                </CardTitle>
                <CardDescription>System configuration and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Temporarily disable the store</p>
                    </div>
                    <Switch
                      checked={localSettings.maintenanceMode}
                      onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notifications
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Email Notifications</Label>
                        <Switch
                          checked={localSettings.emailNotifications}
                          onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">SMS Notifications</Label>
                        <Switch
                          checked={localSettings.smsNotifications}
                          onCheckedChange={(checked) => handleInputChange("smsNotifications", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">WhatsApp Notifications</Label>
                        <Switch
                          checked={localSettings.whatsappNotifications}
                          onCheckedChange={(checked) => handleInputChange("whatsappNotifications", checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Order Alerts
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Order Confirmation Emails</Label>
                        <Switch
                          checked={localSettings.orderConfirmationEmail}
                          onCheckedChange={(checked) => handleInputChange("orderConfirmationEmail", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Low Stock Alerts</Label>
                        <Switch
                          checked={localSettings.lowStockAlerts}
                          onCheckedChange={(checked) => handleInputChange("lowStockAlerts", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">New Order Alerts</Label>
                        <Switch
                          checked={localSettings.newOrderAlerts}
                          onCheckedChange={(checked) => handleInputChange("newOrderAlerts", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Settings Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings Summary
              </CardTitle>
              <CardDescription>Overview of your current configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Store</p>
                  <p className="text-lg font-bold text-gray-900">{localSettings.storeName}</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Currency</p>
                  <p className="text-lg font-bold text-gray-900">{localSettings.currency}</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Tax Rate</p>
                  <p className="text-lg font-bold text-gray-900">{localSettings.taxRate}%</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <Badge variant={localSettings.maintenanceMode ? "destructive" : "default"}>
                    {localSettings.maintenanceMode ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 