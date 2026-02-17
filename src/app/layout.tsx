import type { Metadata, Viewport } from "next"
import { Outfit, Fira_Code } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CourseSidebar } from "@/components/navigation/CourseSidebar"
import { MobileNav } from "@/components/navigation/MobileNav"
import { getCourseStructure } from "@/lib/content/loader"

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
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
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${firaCode.variable} font-sans antialiased`}>
        <SidebarProvider>
          <CourseSidebar structure={structure} />
          <SidebarInset>
            <header className="sticky top-0 z-10 glass-subtle flex items-center gap-3 px-4 py-3">
              <MobileNav />
              <div className="h-4 w-px bg-white/10" />
              <span className="text-xs font-medium tracking-wider uppercase text-slate-500">Academy</span>
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
