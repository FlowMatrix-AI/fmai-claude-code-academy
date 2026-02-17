"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { getLessonPath } from "@/lib/navigation/paths"
import type { CourseStructure } from "@/lib/content/types"

interface CourseSidebarProps {
  structure: CourseStructure
}

export function CourseSidebar({ structure }: CourseSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-white/[0.06] px-4 py-5">
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-bold">
            FM
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
              Claude Code Academy
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-600">
              FMAI Training
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        {structure.modules.map((module) => (
          <SidebarGroup key={module.id}>
            <SidebarGroupLabel className="flex items-center justify-between px-3 py-2 text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
              <span>{module.title}</span>
              <span className="text-slate-700 font-mono tabular-nums">
                {module.lessons.length}
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {module.lessons.map((lesson) => {
                  const lessonPath = getLessonPath(module.id, lesson.id)
                  const isActive = pathname === lessonPath

                  return (
                    <SidebarMenuItem key={lesson.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="text-sm text-slate-400 hover:text-slate-200 data-[active=true]:text-cyan-400 data-[active=true]:bg-cyan-500/10 rounded-lg transition-all"
                      >
                        <Link href={lessonPath}>
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
