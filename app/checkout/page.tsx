"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useSettings } from "@/lib/settings-context"
import { dbHelpers } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Smartphone, MapPin, User, ShoppingBag, Lock, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { settings } = useSettings()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    customerName: user?.full_name || "",
    customerEmail: user?.email || "",
    customerPhone: user?.phone || "",
    shippingAddress: user?.address || "",
    paymentMethod: "mpesa",
    notes: "",
  })

  const totalPrice = getTotalPrice()
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const whatsappNumber = "254703781668"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create order
      const orderData = {
        user_id: user?.id,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        total_amount: totalWithTaxAndShipping,
        payment_method: formData.paymentMethod,
        payment_status: "pending",
        order_status: "pending",
        shipping_address: formData.shippingAddress,
        notes: formData.notes,
      }

      const order = await dbHelpers.createOrder(orderData)

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      await dbHelpers.createOrderItems(orderItems)

      // Send WhatsApp message
      const message = `New Order from ${settings.storeName}!
      
Order Details:
${items.map((item) => `• ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`).join("\n")}

Subtotal: ${formatCurrency(totalPrice)}
Tax (${settings.taxRate}%): ${formatCurrency(taxAmount)}
Shipping: ${finalShippingCost === 0 ? 'Free' : formatCurrency(finalShippingCost)}
Total: ${formatCurrency(totalWithTaxAndShipping)}
Payment: ${formData.paymentMethod.toUpperCase()}

Customer: ${formData.customerName}
Phone: ${formData.customerPhone}
Email: ${formData.customerEmail}
Address: ${formData.shippingAddress}

${formData.notes ? `Notes: ${formData.notes}` : ""}`

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      // Clear cart and redirect
      clearCart()
      toast.success("Order placed successfully!")
      router.push(`/order-success?orderId=${order.id}`)
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
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
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
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
                Checkout
              </h1>
              <p className="text-gray-600 mt-1">Complete your purchase</p>
            </div>
            <Link href="/cart">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </Button>
            </Link>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Information
                    </CardTitle>
                    <CardDescription>Please provide your contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Full Name</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">Email Address</Label>
                        <Input
                          id="customerEmail"
                          name="customerEmail"
                          type="email"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone Number</Label>
                      <Input
                        id="customerPhone"
                        name="customerPhone"
                        type="tel"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingAddress">Shipping Address</Label>
                      <Textarea
                        id="shippingAddress"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Payment Method */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Method
                    </CardTitle>
                    <CardDescription>Choose your preferred payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <Label htmlFor="mpesa" className="flex items-center gap-2 cursor-pointer">
                          <img src="/payment-logos/mpesa.png" alt="M-Pesa" className="w-8 h-8 object-contain" />
                          M-Pesa
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="airtel" id="airtel" />
                        <Label htmlFor="airtel" className="flex items-center gap-2 cursor-pointer">
                          <img src="/payment-logos/airtel.png" alt="Airtel Money" className="w-8 h-8 object-contain" />
                          Airtel Money
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                          <img src="/payment-logos/mastercard.png" alt="Mastercard" className="w-8 h-8 object-contain" />
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                          <span className="inline-block w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">💵</span>
                          Cash on Delivery
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Order Notes */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Additional Notes
                    </CardTitle>
                    <CardDescription>Any special instructions for your order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Delivery instructions, special requests, etc."
                      rows={3}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="sticky top-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={item.image_url || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
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
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Place Order
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="text-center">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Secure checkout
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
