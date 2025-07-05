"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react"
import { supabase, type Product } from "@/lib/supabase"
import { useCart } from "@/lib/cart-context"
import { useSettings } from "@/lib/settings-context"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { settings } = useSettings()
  const { user } = useAuth()

  const formatCurrency = (amount: number) => {
    return `${settings.currency} ${amount.toLocaleString()}`
  }

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase.from("products").select("*").eq("id", params.id).single()

      if (error) {
        console.error("Error fetching product:", error)
        toast.error("Product not found")
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    }, quantity)
    toast.success(`${quantity} ${product.name}(s) added to cart!`)
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Product link copied to clipboard!")
    }
  }

  const whatsappNumber = "254703781668"

  const sendToWhatsApp = () => {
    if (!product) return
    const message = `Hi! I'm interested in this product:\n\n*${product.name}*\nPrice: ${formatCurrency(product.price)}\n\n${window.location.href}`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600">The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.featured && <Badge className="absolute top-4 left-4 bg-red-500">Featured</Badge>}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <Badge variant="outline" className="mb-4">
              {product.category}
            </Badge>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">{formatCurrency(product.price)}</span>
              <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {user?.role !== "admin" && (
                <Button onClick={handleAddToCart} disabled={product.stock_quantity === 0} className="flex-1" size="lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={sendToWhatsApp}>
                Order via WhatsApp
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" size="sm" onClick={shareProduct}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <Separator />

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Product Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• High-quality materials and construction</li>
                <li>• Manufacturer warranty included</li>
                <li>• Fast and secure delivery</li>
                <li>• 30-day return policy</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
