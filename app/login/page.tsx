"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Eye, EyeOff, Mail, Lock, LogIn, Shield, AlertCircle, CheckCircle, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

function LoginPageContent() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isAdminLogin, setIsAdminLogin] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.values(newErrors).every((error) => error === "")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setLoading(true)
    try {
      const result = await signIn(formData.email, formData.password, isAdminLogin)

      if (result.success) {
        toast.success("Welcome back!")
        // The redirect is handled in the auth context based on user role
      } else {
        toast.error(result.error || "Invalid email or password")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchParams.get("admin") === "true") {
      setIsAdminLogin(true)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {isAdminLogin ? "Admin Login" : "Welcome Back"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {isAdminLogin ? "Access the admin dashboard" : "Sign in to your MashElectronics account"}
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                Sign In
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm sm:text-base">
                Access your account securely
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium text-sm sm:text-base">
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Admin Login Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-600" />
                    <Label htmlFor="admin-login" className="text-sm font-medium text-gray-700">
                      Admin Login
                    </Label>
                  </div>
                  <Switch
                    id="admin-login"
                    checked={isAdminLogin}
                    onCheckedChange={setIsAdminLogin}
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <Separator />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      {isAdminLogin ? "Signing In as Admin..." : "Signing In..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                      {isAdminLogin ? "Admin Sign In" : "Sign In"}
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 sm:p-4 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <span className="font-semibold text-green-800 text-xs sm:text-sm">Secure Login</span>
                  </div>
                  <p className="text-xs sm:text-sm text-green-700">
                    Your login is protected with SSL encryption and secure authentication.
                  </p>
                </div>

                {/* Register Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                      Create one here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 sm:mt-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: Shield, title: "Secure", desc: "SSL Protected" },
              { icon: CheckCircle, title: "Trusted", desc: "50K+ Users" },
              { icon: LogIn, title: "Fast", desc: "Quick Access" },
            ].map((feature, index) => (
              <div key={index} className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{feature.title}</h3>
                <p className="text-gray-600 text-xs">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
