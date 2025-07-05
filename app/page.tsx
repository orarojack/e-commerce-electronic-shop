"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { CardContent } from "@/components/ui/card"
import ProductCard from "@/components/product-card"
import { dbHelpers } from "@/lib/supabase"
import {
  ArrowRight,
  Shield,
  Truck,
  Headphones,
  Star,
  Zap,
  Award,
  Package,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("Fetching featured products...")
        const { data, error } = await dbHelpers.getProducts({ featured: true })
        console.log("Featured products result:", { data: data?.length || 0, error })
        setFeaturedProducts(data || [])
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const dotPattern =
    "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
  const circlePattern =
    "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.03'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
  const whiteDotsPattern =
    "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

  return (
    <div className="space-y-0 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("${dotPattern}")`,
            }}
          />

          {/* Floating Elements */}
          <motion.div
            className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              x: [0, -30, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              className="space-y-6 sm:space-y-8 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg"
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2 sm:mr-3" />
                <span className="text-xs sm:text-sm font-semibold">Trusted by 50,000+ customers</span>
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 ml-2" />
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-4 sm:space-y-6">
                <motion.h1
                  className="text-4xl sm:text-6xl lg:text-8xl font-black leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Future-Ready
                  <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                    Electronics
                  </span>
                  <span className="block text-2xl sm:text-4xl lg:text-5xl text-blue-200 font-medium">
                    Delivered Today
                  </span>
                </motion.h1>

                <motion.p
                  className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Experience tomorrow's technology today. Premium electronics with lightning-fast delivery, unbeatable
                  prices, and world-class support across Kenya.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 rounded-2xl group w-full sm:w-auto"
                  >
                    <Zap className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
                    Shop Now
                    <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 transform hover:scale-105 bg-transparent rounded-2xl hover:border-white/50 w-full sm:w-auto"
                  >
                    <Package className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                    Browse Catalog
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-12 pt-6 sm:pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {[
                  { number: "50K+", label: "Happy Customers", icon: Users },
                  { number: "1000+", label: "Products", icon: Package },
                  { number: "24/7", label: "Support", icon: Headphones },
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mr-2 group-hover:animate-bounce" />
                      <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{stat.number}</div>
                    </div>
                    <div className="text-sm text-blue-200 font-medium">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="relative order-first lg:order-last"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl transform rotate-6"></div>

                {/* Main Image */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <Image
                    src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"
                    alt="Premium Electronics Collection"
                    width={700}
                    height={500}
                    className="rounded-3xl shadow-2xl w-full h-auto"
                  />
                </motion.div>

                {/* Floating Cards */}
                <motion.div
                  className="absolute -bottom-4 sm:-bottom-8 -left-4 sm:-left-8 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-sm z-20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8" />
                    <div>
                      <div className="font-bold text-sm sm:text-lg">Free Delivery</div>
                      <div className="text-xs sm:text-sm opacity-90">Same day in Nairobi</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -top-4 sm:-top-8 -right-4 sm:-right-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-sm z-20"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Award className="h-6 w-6 sm:h-8 sm:w-8" />
                    <div>
                      <div className="font-bold text-sm sm:text-lg">Best Quality</div>
                      <div className="text-xs sm:text-sm opacity-90">Guaranteed authentic</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("${circlePattern}")`,
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-100 rounded-full mb-4 sm:mb-6">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-semibold text-sm sm:text-base">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Unmatched Excellence
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're not just another electronics store. We're your technology partners, committed to delivering
              exceptional experiences at every touchpoint.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: "Premium Quality",
                description: "Every product is authentic with full manufacturer warranty and quality guarantee",
                color: "from-blue-500 to-blue-600",
                delay: 0,
                bgGradient: "from-blue-50 to-blue-100",
              },
              {
                icon: Truck,
                title: "Lightning Delivery",
                description: "Same-day delivery in Nairobi, express shipping nationwide with real-time tracking",
                color: "from-green-500 to-green-600",
                delay: 0.1,
                bgGradient: "from-green-50 to-green-100",
              },
              {
                icon: Headphones,
                title: "Expert Support",
                description: "24/7 technical support from certified experts via WhatsApp, phone, and live chat",
                color: "from-purple-500 to-purple-600",
                delay: 0.2,
                bgGradient: "from-purple-50 to-purple-100",
              },
              {
                icon: Award,
                title: "Best Prices",
                description: "Competitive pricing with price matching, exclusive deals, and loyalty rewards",
                color: "from-orange-500 to-orange-600",
                delay: 0.3,
                bgGradient: "from-orange-50 to-orange-100",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <AnimatedCard delay={feature.delay} className="h-full">
                  <CardContent
                    className={`p-6 sm:p-8 text-center h-full flex flex-col bg-gradient-to-br ${feature.bgGradient} border-0`}
                  >
                    <motion.div
                      className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                      whileHover={{ rotate: 12, scale: 1.1 }}
                    >
                      <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </motion.div>
                    <h3 className="font-black text-xl sm:text-2xl mb-3 sm:mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed flex-1 text-base sm:text-lg">{feature.description}</p>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-4 sm:mb-6">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-semibold text-sm sm:text-base">Handpicked Collection</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our most popular electronics, carefully selected for exceptional quality, cutting-edge features,
              and unbeatable value.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 sm:h-64 rounded-2xl mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 rounded-2xl group"
              >
                <Package className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
                Explore All Products
                <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("${whiteDotsPattern}")`,
            }}
          />
          <motion.div
            className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full mb-6 sm:mb-8 border border-white/20">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2" />
              <span className="text-xs sm:text-sm font-semibold">Ready to Upgrade?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-6 sm:mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Digital Life
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Join over 50,000 satisfied customers who trust MashElectronics for their technology needs. Experience
              premium quality, unbeatable prices, and exceptional service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 rounded-2xl group w-full sm:w-auto"
                >
                  <Sparkles className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-spin" />
                  Start Shopping Now
                  <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 transform hover:scale-105 bg-transparent rounded-2xl hover:border-white/50 w-full sm:w-auto"
                >
                  <Headphones className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  Get Expert Advice
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
