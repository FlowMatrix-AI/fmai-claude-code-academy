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
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-800 p-4">
        <Link
          href="/"
          className="text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          FMAI Claude Code Academy
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {structure.modules.map((module) => (
          <SidebarGroup key={module.id}>
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>{module.title}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
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
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={lessonPath}>{lesson.title}</Link>
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
