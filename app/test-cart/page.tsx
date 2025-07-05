"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestCartPage() {
  const { items, addToCart, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart()

  const testProduct = {
    id: "test-1",
    name: "Test Product",
    price: 99.99,
    image_url: "/placeholder.svg",
  }

  const handleAddTestProduct = () => {
    addToCart(testProduct)
  }

  const handleAddWithQuantity = () => {
    addToCart(testProduct, 3)
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Cart Functionality Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleAddTestProduct}>Add Test Product</Button>
            <Button onClick={handleAddWithQuantity}>Add 3 Test Products</Button>
            <Button onClick={clearCart} variant="destructive">Clear Cart</Button>
          </div>

          <div className="space-y-2">
            <p><strong>Total Items:</strong> {getTotalItems()}</p>
            <p><strong>Total Price:</strong> Ksh {getTotalPrice().toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Cart Items:</h3>
            {items.length === 0 ? (
              <p className="text-gray-500">No items in cart</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p>{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} | Ksh {item.price.toLocaleString()}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 