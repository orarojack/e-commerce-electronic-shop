"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestDBPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Testing Supabase connection...")
      console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log("Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      
      const { data, error } = await supabase.from("products").select("*").limit(5)
      
      if (error) {
        console.error("Database error:", error)
        setError(error.message)
      } else {
        console.log("Products found:", data?.length || 0)
        setProducts(data || [])
      }
    } catch (err) {
      console.error("Connection error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? "Testing..." : "Test Database Connection"}
          </Button>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {products.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800">Success!</h3>
              <p className="text-green-600">Found {products.length} products in database</p>
              <div className="mt-2 space-y-1">
                {products.map((product) => (
                  <div key={product.id} className="text-sm">
                    {product.name} - Ksh {product.price.toLocaleString()}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p>Environment Variables:</p>
            <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"}</p>
            <p>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 