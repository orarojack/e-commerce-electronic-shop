"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import { useSettings } from "@/lib/settings-context"
import { motion } from "framer-motion"

export default function ContactPage() {
  const { settings } = useSettings()
  const sendWhatsAppMessage = () => {
    const message = `Hi! I'd like to get in touch with ${settings.storeName}.`
    const whatsappUrl = `https://wa.me/${settings.contactPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get in touch with our team – we're here to help you with anything electronics!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/90 text-gray-900 shadow-xl border-0 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" className="bg-gray-50" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" className="bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder={settings.contactPhone} className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={5} className="bg-gray-50" />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <Card className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-200">{settings.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-200">{settings.contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-200">{settings.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-200">Mon - Sat: 8:00 AM - 8:00 PM</p>
                    <p className="text-gray-200">Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-700/80 to-blue-700/80 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Quick Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 mb-4">
                  Need immediate assistance? Contact us directly via WhatsApp for the fastest response.
                </p>
                <Button onClick={sendWhatsAppMessage} className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 transition-all duration-300">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-800/80 to-purple-800/80 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Visit Our Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 mb-4">
                  Come visit our physical store to see our products in person and get expert advice from our team.
                </p>
                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="font-medium">{settings.storeName} Store</p>
                  <p className="text-gray-100">{settings.address}</p>
                  <p className="text-gray-100">Kenya</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
