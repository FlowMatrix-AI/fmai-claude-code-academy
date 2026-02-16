import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CourseSidebar } from "@/components/navigation/CourseSidebar"
import { MobileNav } from "@/components/navigation/MobileNav"
import { getCourseStructure } from "@/lib/content/loader"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "FMAI Claude Code Academy",
  description:
    "Interactive training for the FlowMatrix AI Claude Code system - agents, plugins, skills, hooks, MCPs, and config architecture.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structure = await getCourseStructure()

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white text-slate-900`}>
        <SidebarProvider>
          <CourseSidebar structure={structure} />
          <SidebarInset>
            <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 md:hidden">
              <MobileNav />
            </header>
            <main className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
