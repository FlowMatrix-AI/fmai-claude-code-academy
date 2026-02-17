import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getModulePath } from "@/lib/navigation/paths"

interface LessonBreadcrumbsProps {
  moduleTitle: string
  lessonTitle: string
  moduleId: string
}

export function LessonBreadcrumbs({
  moduleTitle,
  lessonTitle,
  moduleId,
}: LessonBreadcrumbsProps) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList className="text-xs font-mono">
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="text-slate-500 hover:text-cyan-400 transition-colors">
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-slate-700">/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="text-slate-500 hover:text-cyan-400 transition-colors">
            <Link href={getModulePath(moduleId)}>{moduleTitle}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-slate-700">/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-slate-300">{lessonTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
