import Link from "next/link"
import { getCourseStructure } from "@/lib/content/loader"
import { getModulePath } from "@/lib/navigation/paths"

const moduleIcons: Record<string, string> = {
  architecture: "01",
  agents: "02",
  plugins: "03",
  skills: "04",
  hooks: "05",
  mcps: "06",
  config: "07",
}

export default async function Home() {
  const structure = await getCourseStructure()
  const totalLessons = structure.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  )

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero */}
      <div className="pt-8 pb-16 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          v{structure.systemVersion}
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          <span className="text-white">FMAI</span>
          <br />
          <span className="gradient-text">Claude Code</span>
          <br />
          <span className="text-white">Academy</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-8">
          Master the full FlowMatrix AI Claude Code system. From agents to
          hooks, plugins to MCPs — everything you need to operate independently.
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-cyan-500" />
            {structure.modules.length} Modules
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-blue-500" />
            {totalLessons} Lessons
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-violet-500" />
            Self-paced
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {structure.modules.map((module, i) => {
          const firstLesson = module.lessons[0]
          const moduleLink = firstLesson
            ? `/modules/${module.id}/${firstLesson.id}`
            : getModulePath(module.id)

          return (
            <Link
              key={module.id}
              href={moduleLink}
              className="animate-fade-up"
              style={{ animationDelay: `${100 + i * 80}ms` }}
            >
              <div className="gradient-border group h-full transition-all duration-300 hover:-translate-y-1">
                <div className="relative p-6 h-full">
                  {/* Module number watermark */}
                  <div className="absolute top-4 right-4 text-4xl font-bold text-white/[0.03] select-none">
                    {moduleIcons[module.id] || String(module.order).padStart(2, "0")}
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold font-mono flex-shrink-0">
                      {String(module.order).padStart(2, "0")}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors leading-snug">
                      {module.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-mono">
                      {module.lessons.length} lessons
                    </span>
                    <span className="text-xs text-cyan-500/60 group-hover:text-cyan-400 transition-colors">
                      Start &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
