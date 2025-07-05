"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, Heart, Star, Eye, Zap, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/supabase"
import { useCart } from "@/lib/cart-context"
import { useSettings } from "@/lib/settings-context"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { settings } = useSettings()
  const { user } = useAuth()

  const formatCurrency = (amount: number) => {
    return `${settings.currency} ${amount.toLocaleString()}`
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
    toast.success("🛒 Added to cart!", {
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden h-full flex flex-col relative">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

        <CardContent className="p-0 flex-1 relative z-10">
          <div className="relative overflow-hidden rounded-t-2xl">
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </Link>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href={`/products/${product.id}`}>
                  <Button
                    size="sm"
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="sm"
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {/* Status Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm">
                    <Award className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </motion.div>
              )}
              {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                  <Zap className="h-3 w-3 mr-1" />
                  Low Stock
                </Badge>
              )}
              {product.stock_quantity === 0 && <Badge className="bg-gray-500 text-white shadow-lg">Out of Stock</Badge>}
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-500 ml-2">(4.8)</span>
              <Badge variant="secondary" className="ml-auto text-xs bg-green-100 text-green-700">
                Best Seller
              </Badge>
            </div>

            {/* Product Name */}
            <Link href={`/products/${product.id}`}>
              <h3 className="font-bold text-lg mb-3 hover:text-blue-600 transition-colors line-clamp-2 flex-1 group-hover:text-blue-600">
                {product.name}
              </h3>
            </Link>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>

            {/* Price and Stock */}
            <div className="flex items-end justify-between mb-4">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">{formatCurrency(product.price * 1.2)}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Best Price</span>
                </div>
              </div>
              <Badge
                variant={
                  product.stock_quantity > 10 ? "default" : product.stock_quantity > 0 ? "secondary" : "destructive"
                }
                className="shadow-sm"
              >
                {product.stock_quantity > 0 ? `${product.stock_quantity} left` : "Sold out"}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 relative z-10">
          <motion.div className="w-full" whileTap={{ scale: 0.95 }}>
            {user?.role !== "admin" && (
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 group"
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            )}
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
