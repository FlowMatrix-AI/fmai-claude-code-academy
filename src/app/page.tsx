import Link from "next/link"
import { getCourseStructure } from "@/lib/content/loader"
import { getModulePath } from "@/lib/navigation/paths"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

export default async function Home() {
  const structure = await getCourseStructure()

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
            FMAI Claude Code Academy
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 sm:text-xl max-w-3xl mx-auto">
            Learn the full FMAI Claude Code system well enough to use it
            independently and teach others, without needing to shadow the
            person who built it.
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Comprehensive training covering Agents, Plugins, Skills, Hooks,
            MCPs, and Configuration Architecture
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {structure.modules.map((module) => {
            const lessonCount = module.lessons.length
            const firstLesson = module.lessons[0]
            const moduleLink = firstLesson
              ? `/modules/${module.id}/${firstLesson.id}`
              : getModulePath(module.id)

            return (
              <Link key={module.id} href={moduleLink}>
                <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {module.title}
                        </CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-semibold ml-2">
                        {module.order}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Version {structure.systemVersion} • {structure.modules.length}{" "}
            Modules •{" "}
            {structure.modules.reduce(
              (total, module) => total + module.lessons.length,
              0
            )}{" "}
            Lessons
          </p>
        </div>
      </div>
    </main>
  )
}
