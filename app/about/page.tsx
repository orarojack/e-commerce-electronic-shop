import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Truck, Headphones, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About MashElectronics</h1>
          <p className="text-xl text-gray-600">Your trusted partner for quality electronics in Kenya</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2020, MashElectronics has been at the forefront of bringing the latest technology to Kenyan
              consumers. We started with a simple mission: to make quality electronics accessible to everyone while
              providing exceptional customer service.
            </p>
            <p className="text-gray-600 mb-4">
              Today, we're proud to serve thousands of customers across Kenya, offering everything from smartphones and
              laptops to audio equipment and smart home devices. Our commitment to quality, competitive pricing, and
              customer satisfaction has made us a trusted name in the electronics industry.
            </p>
            <p className="text-gray-600">
              We believe that technology should enhance lives, and we're here to help you find the perfect devices to
              meet your needs, whether for work, entertainment, or staying connected with loved ones.
            </p>
          </div>
          <div>
            <Image
              src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"
              alt="Electronics Store"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Quality Assurance</h3>
              <p className="text-gray-600">All products are genuine and come with manufacturer warranties</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery across Kenya</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Headphones className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
              <p className="text-gray-600">Knowledgeable team ready to help with your tech needs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing on all our products</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            To democratize access to cutting-edge technology by providing high-quality electronics at competitive
            prices, backed by exceptional customer service and support.
          </p>
        </div>
      </div>
    </div>
  )
}
