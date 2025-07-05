"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  Eye,
  EyeOff,
  Shield,
  Edit,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { dbHelpers } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser, updatePassword } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }

    if (user) {
      setProfileForm({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [user, authLoading, router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const updateFunction = user.role === "admin" ? dbHelpers.updateAdmin : dbHelpers.updateUser
      const { data, error } = await updateFunction(user.id, {
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        address: profileForm.address,
      })

      if (error) throw error

      // Update local user state
      updateUser({
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        address: profileForm.address,
      })

      toast.success("✅ Profile updated successfully!", {
        description: "Your profile information has been saved.",
      })
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error("Failed to update profile", {
        description: "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "New passwords don't match. Please try again.",
      })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Weak Password", {
        description: "Password must be at least 6 characters long.",
      })
      return
    }

    setLoading(true)
    try {
      const result = await updatePassword(passwordForm.currentPassword, passwordForm.newPassword)

      if (result.success) {
        toast.success("🔒 Password updated successfully!", {
          description: "Your password has been changed securely.",
        })
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast.error("Password Update Failed", {
          description: result.error || "Please check your current password.",
        })
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-white text-2xl font-bold">{user.full_name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 text-lg">Manage your account settings and preferences</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white capitalize">{user.role}</Badge>
              <Badge variant="outline" className="border-green-500 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </motion.div>

          {/* Profile Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile Information
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security Settings
                </TabsTrigger>
              </TabsList>

              {/* Profile Information Tab */}
              <TabsContent value="profile">
                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <CardTitle className="flex items-center gap-3">
                      <Edit className="h-6 w-6" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="full_name" className="text-gray-700 font-medium">
                            Full Name *
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="full_name"
                              value={profileForm.full_name}
                              onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                              className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="email"
                              type="email"
                              value={profileForm.email}
                              className="pl-10 border-gray-200 bg-gray-50 cursor-not-allowed"
                              disabled
                            />
                          </div>
                          <p className="text-xs text-gray-500">Email cannot be changed for security reasons</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="phone"
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="+254 700 123 456"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-gray-700 font-medium">
                          Address
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                          <Input
                            id="address"
                            value={profileForm.address}
                            onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="Enter your complete address"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <LoadingSpinner size="sm" />
                              Updating...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Save className="h-4 w-4" />
                              Save Changes
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings Tab */}
              <TabsContent value="security">
                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
                    <CardTitle className="flex items-center gap-3">
                      <Shield className="h-6 w-6" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Security Notice</span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        Choose a strong password with at least 6 characters. Your password is encrypted and secure.
                      </p>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                          Current Password *
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="pl-10 pr-10 border-gray-200 focus:border-red-500 focus:ring-red-500/20"
                            placeholder="Enter your current password"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                            New Password *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="pl-10 pr-10 border-gray-200 focus:border-red-500 focus:ring-red-500/20"
                              placeholder="Enter new password"
                              required
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                            Confirm New Password *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              className="pl-10 pr-10 border-gray-200 focus:border-red-500 focus:ring-red-500/20"
                              placeholder="Confirm new password"
                              required
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <LoadingSpinner size="sm" />
                              Updating...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Update Password
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
