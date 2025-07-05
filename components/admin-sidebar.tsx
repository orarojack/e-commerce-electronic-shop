"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 shadow-2xl">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="MashElectronics" width={32} height={32} />
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-gray-400 text-sm">MashElectronics</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-blue-600/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-200">Welcome back,</p>
          <p className="font-semibold text-blue-100">{user?.full_name}</p>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white hover:transform hover:scale-105",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-red-600/20 transition-colors"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}
