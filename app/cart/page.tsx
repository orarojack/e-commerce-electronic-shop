"use client"

import { useCart } from "@/lib/cart-context"
import { useSettings } from "@/lib/settings-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart()
  const { settings } = useSettings()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(id)
      toast.success("Item removed from cart")
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id)
    toast.success(`${name} removed from cart`)
  }

  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()
  
  // Calculate tax and shipping based on settings
  const taxRate = parseFloat(settings.taxRate) / 100
  const taxAmount = totalPrice * taxRate
  const shippingCost = parseFloat(settings.shippingCost)
  const freeShippingThreshold = parseFloat(settings.freeShippingThreshold)
  const finalShippingCost = totalPrice >= freeShippingThreshold ? 0 : shippingCost
  const totalWithTaxAndShipping = totalPrice + taxAmount + finalShippingCost

  const formatCurrency = (amount: number) => {
    return `${settings.currency} ${amount.toLocaleString()}`
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/products">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image_url || "/placeholder.svg?height=128&width=128"}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                              <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(item.price)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id, item.name)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 self-start"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-gray-700">Quantity:</span>
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="h-10 w-10 p-0 hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <div className="w-12 h-10 flex items-center justify-center bg-gray-50 font-medium">
                                  {item.quantity}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="h-10 w-10 p-0 hover:bg-gray-100"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Subtotal</p>
                              <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="sticky top-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className={`font-medium ${finalShippingCost === 0 ? 'text-green-600' : ''}`}>
                        {finalShippingCost === 0 ? 'Free' : formatCurrency(finalShippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax ({settings.taxRate}%)</span>
                      <span className="font-medium">{formatCurrency(taxAmount)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatCurrency(totalWithTaxAndShipping)}</span>
                  </div>

                  {totalPrice < freeShippingThreshold && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                      Add {formatCurrency(freeShippingThreshold - totalPrice)} more for free shipping!
                    </div>
                  )}

                  <div className="space-y-3 pt-4">
                    <Link href="/checkout" className="block">
                      <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
