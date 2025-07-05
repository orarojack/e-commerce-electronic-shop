"use client"

import { motion } from "framer-motion"
import { Card, type CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends CardProps {
  delay?: number
  hover?: boolean
}

export function AnimatedCard({ children, className, delay = 0, hover = true, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full transition-all duration-300 hover:shadow-xl border-0 bg-white/80 backdrop-blur-sm",
          className,
        )}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  )
}
