"use client"

import { useSettings } from "@/lib/settings-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wrench, Clock, Mail, Phone, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export default function MaintenanceMode() {
  const { settings } = useSettings()

  if (!settings.maintenanceMode) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-10 h-10 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Under Maintenance
            </CardTitle>
            <CardDescription className="text-gray-600">
              We're currently performing some maintenance on our site. We'll be back shortly!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                <Clock className="w-3 h-3 mr-1" />
                Estimated time: 30 minutes
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">What's happening?</p>
                  <p className="text-sm text-blue-700">
                    We're updating our systems to provide you with a better experience.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Need immediate assistance?</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{settings.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{settings.contactPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Try Again
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>© 2024 {settings.storeName}. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 