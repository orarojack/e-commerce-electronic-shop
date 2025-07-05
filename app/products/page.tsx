"use client"

import { useState, useEffect, Suspense } from "react"
import ProductCard from "@/components/product-card"
import { supabase, type Product } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"

function ProductSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <Skeleton className="w-full h-64" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <div className="p-4 pt-0">
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const category = searchParams.get("category")

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        let query = supabase.from("products").select("*")

        if (category) {
          query = query.eq("category", category)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching products:", error)
          setProducts([])
        } else {
          console.log("Fetched products:", data?.length || 0, "products")
          setProducts(data || [])
        }
      } catch (error) {
        console.error("Error:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : "All Products"}
          </h1>
          <p className="text-gray-600">
            {category ? `Browse our selection of ${category}` : "Discover our complete range of electronics"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : "All Products"}
          </h1>
          <p className="text-gray-600">
            {category ? `Browse our selection of ${category}` : "Discover our complete range of electronics"}
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : "All Products"}
        </h1>
        <p className="text-gray-600">
          {category ? `Browse our selection of ${category}` : "Discover our complete range of electronics"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-lg text-gray-500">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
