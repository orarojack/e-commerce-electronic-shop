"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowRight, Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/lib/settings-context"

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-40"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                  <Image
                    src="/logo.png"
                    alt={settings.storeName}
                    width={24}
                    height={24}
                    className="sm:w-8 sm:h-8"
                  />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {settings.storeName}
                </span>
                <div className="text-xs text-gray-400 font-medium tracking-wide">PREMIUM ELECTRONICS</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {settings.storeDescription}
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, color: "hover:text-blue-400" },
                { icon: Twitter, color: "hover:text-sky-400" },
                { icon: Instagram, color: "hover:text-pink-400" },
              ].map((social, index) => (
                <motion.div key={index} whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-2 text-gray-400 ${social.color} transition-colors duration-300 hover:bg-white/10 rounded-xl`}
                  >
                    <social.icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Support", href: "/support" },
              ].map((link, index) => (
                <motion.li key={link.name} whileHover={{ x: 5 }}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Categories
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Smartphones", href: "/products?category=smartphones" },
                { name: "Laptops", href: "/products?category=laptops" },
                { name: "Audio", href: "/products?category=audio" },
                { name: "Wearables", href: "/products?category=wearables" },
                { name: "Gaming", href: "/products?category=gaming" },
              ].map((category, index) => (
                <motion.li key={category.name} whileHover={{ x: 5 }}>
                  <Link
                    href={category.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {category.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Stay Connected
            </h3>

            {/* Contact Info */}
            <div className="space-y-4">
              {[
                { icon: Phone, text: settings.contactPhone, color: "text-green-400" },
                { icon: Mail, text: settings.contactEmail, color: "text-blue-400" },
                { icon: MapPin, text: settings.address, color: "text-purple-400" },
              ].map((contact, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <contact.icon className={`h-5 w-5 ${contact.color}`} />
                  <span className="text-gray-300">{contact.text}</span>
                </div>
              ))}
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-green-400" />
                <a href="https://wa.me/254703781668" target="_blank" rel="noopener noreferrer" className="text-green-300 underline hover:text-green-500 font-semibold">+254 703 781 668</a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Newsletter</h4>
              <p className="text-sm text-gray-400">Get the latest deals and updates</p>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-400 rounded-xl"
                />
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 rounded-xl">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-700 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© 2024 {settings.storeName}. Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current" />
              <span>in Kenya</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
