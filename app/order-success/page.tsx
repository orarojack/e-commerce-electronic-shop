import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, Package } from "lucide-react"

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Thank you for your order! We've received your order details and will contact you shortly to confirm
              payment and delivery.
            </p>
            <p className="text-sm text-gray-500">
              You should receive a WhatsApp message from our team within the next few minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
