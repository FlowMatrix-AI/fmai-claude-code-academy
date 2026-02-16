import fs from "fs/promises"
import path from "path"
import { glob } from "glob"

/**
 * Scan content directory for all markdown files and return kebab-case slugs.
 */
export async function getAllContentSlugs(baseDir: string): Promise<string[]> {
  const files = await glob("**/*.md", { cwd: baseDir })

  return files.map((file) => {
    const name = path.basename(file, ".md")
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  })
}

/**
 * Build a map from Obsidian note names (as used in wikilinks) to web route paths.
 *
 * For example:
 *   "Architecture Overview" -> "architecture/overview"
 *   "GSD Pipeline Agents"  -> "agents/gsd-pipeline"
 *   "Hook Reference"       -> "hooks/hook-reference"
 *   "Settings & Orchestration" -> "config/settings-orchestration"
 *   "CLAUDE.md Guide"      -> "config/claude-md-guide"
 *
 * The map is built from meta.json to ensure all wikilinks resolve to the
 * correct moduleId/lessonId route.
 */
export async function buildPermalinkMap(
  baseDir: string
): Promise<Record<string, string>> {
  const metaPath = path.join(baseDir, "meta.json")
  const metaContent = await fs.readFile(metaPath, "utf-8")
  const meta = JSON.parse(metaContent)

  const map: Record<string, string> = {}

  // Map from original Obsidian note names to routes
  // We need to handle the mapping between source file titles and their routes
  const titleToRoute: Record<string, string> = {
    // architecture
    "Architecture Overview": "architecture/overview",

    // agents
    "Agent Hierarchy Overview": "agents/index",
    "GSD Pipeline Agents": "agents/gsd-pipeline",
    "Specialist Agents": "agents/specialist",
    "Dev-Config Agents": "agents/dev-config",
    "Automation Suite Agents": "agents/automation-suite",
    "Agent Design Patterns": "agents/design-patterns",

    // plugins
    "Plugin Reference": "plugins/plugin-reference",

    // hooks
    "Hook Reference": "hooks/hook-reference",

    // skills
    "Skills Reference": "skills/skills-reference",

    // mcps
    "MCP Reference": "mcps/mcp-reference",

    // config
    "Settings & Orchestration": "config/settings-orchestration",
    "CLAUDE.md Guide": "config/claude-md-guide",
    "Session Infrastructure": "config/session-infrastructure",
    "Local vs Remote Layers": "config/local-vs-remote",
  }

  // Also add lesson titles from meta.json as alternative lookup keys
  for (const mod of meta.modules) {
    for (const lesson of mod.lessons) {
      const route = `${mod.id}/${lesson.id}`
      // Map the meta.json title to route
      if (!Object.values(titleToRoute).includes(route)) {
        map[lesson.title] = route
      }
    }
  }

  // Merge the explicit title-to-route mapping
  Object.assign(map, titleToRoute)

  return map
}

/**
 * Convert a heading text to a URL-safe anchor slug.
 * Matches how rehype-slug generates heading IDs.
 *
 * "auto-gsd-workflow.sh" -> "auto-gsd-workflowsh"
 * Actually we preserve hyphens and convert dots/spaces:
 * "auto-gsd-workflow.sh" -> "auto-gsd-workflowsh"
 *
 * But rehype-slug uses github-slugger behavior:
 * "auto-gsd-workflow.sh" -> "auto-gsd-workflowsh"
 */
export function headingToAnchor(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
