"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, AlertCircle, ArrowRight, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function RegisterPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation
    const phoneRegex = /^(\+254|0)[17]\d{8}$/
    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Kenyan phone number"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone: formData.phone,
      })

      if (result.success) {
        toast.success("Account created successfully! Please sign in.")
        router.push("/login")
      } else {
        toast.error(result.error || "Failed to create account")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    if (password.length >= 6) strength += 1
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Very Weak", color: "bg-red-500" },
      { strength: 2, label: "Weak", color: "bg-orange-500" },
      { strength: 3, label: "Fair", color: "bg-yellow-500" },
      { strength: 4, label: "Good", color: "bg-blue-500" },
      { strength: 5, label: "Strong", color: "bg-green-500" },
    ]

    return levels[strength]
  }

  const passwordStrength = getPasswordStrength()

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
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Join MashElectronics and start shopping today</p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                Register
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm sm:text-base">
                Create your account to access exclusive deals
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium text-sm sm:text-base">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                        errors.fullName ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

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

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium text-sm sm:text-base">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="+254 700 123 456"
                      required
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.phone}
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
                      placeholder="Create a strong password"
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 sm:h-2 flex-1 rounded-full transition-colors duration-300 ${
                              level <= passwordStrength.strength ? passwordStrength.color : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      {passwordStrength.label && (
                        <p
                          className={`text-xs sm:text-sm font-medium ${
                            passwordStrength.strength >= 4
                              ? "text-green-600"
                              : passwordStrength.strength >= 3
                                ? "text-blue-600"
                                : passwordStrength.strength >= 2
                                  ? "text-yellow-600"
                                  : "text-red-600"
                          }`}
                        >
                          Password strength: {passwordStrength.label}
                        </p>
                      )}
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium text-sm sm:text-base">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-green-600 text-xs sm:text-sm flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      Passwords match
                    </p>
                  )}
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
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
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      Create Account
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800 text-xs sm:text-sm">Secure Registration</span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Your information is encrypted and secure. We never share your personal data.
                  </p>
                </div>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                      Sign in here
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
              { icon: CheckCircle, title: "Verified", desc: "Trusted Store" },
              { icon: User, title: "Support", desc: "24/7 Help" },
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
