"use client"

import { Menu } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function MobileNav() {
  return (
    <div className="md:hidden">
      <SidebarTrigger>
        <Menu className="h-6 w-6" />
      </SidebarTrigger>
    </div>
  )
}
