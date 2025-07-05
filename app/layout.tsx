import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MaintenanceMode from "@/components/maintenance-mode"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { SettingsProvider } from "@/lib/settings-context"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MashElectronics - Quality Electronics Store",
  description:
    "Shop the latest electronics including smartphones, laptops, audio equipment, and more at MashElectronics.",
  keywords: "electronics, smartphones, laptops, audio, tablets, wearables, Kenya",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            <CartProvider>
              <MaintenanceMode />
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster position="top-right" />
            </CartProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
