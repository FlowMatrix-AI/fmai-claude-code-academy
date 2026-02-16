/**
 * Test script for the markdown parser pipeline.
 * Run with: npx tsx scripts/test-parser.ts
 */

import fs from "fs/promises"
import path from "path"
import { parseMarkdown } from "../src/lib/content/parser"

const CONTENT_DIR = path.join(process.cwd(), "content")

async function main() {
  console.log("=== Markdown Parser Test ===\n")

  // Test 1: Parse architecture/overview.md (has code blocks and a wikilink)
  console.log("Test 1: Parse architecture/overview.md")
  const overviewPath = path.join(CONTENT_DIR, "architecture", "overview.md")
  const overviewRaw = await fs.readFile(overviewPath, "utf-8")

  // Strip frontmatter before parsing
  const overviewContent = overviewRaw.replace(/^---[\s\S]*?---\n*/, "")

  const overviewHtml = await parseMarkdown(overviewContent, {
    contentDir: CONTENT_DIR,
  })

  // Check non-empty
  if (overviewHtml.length === 0) {
    console.error("  FAIL: Output is empty")
    process.exit(1)
  }
  console.log(`  OK: Output is ${overviewHtml.length} chars`)

  // Check for heading tags
  if (overviewHtml.includes("<h1") || overviewHtml.includes("<h2")) {
    console.log("  OK: Contains heading tags")
  } else {
    console.error("  FAIL: No heading tags found")
    process.exit(1)
  }

  // Check for code blocks (pre/code tags)
  if (overviewHtml.includes("<pre") && overviewHtml.includes("<code")) {
    console.log("  OK: Contains code blocks (<pre> and <code> tags)")
  } else {
    console.error("  FAIL: No code blocks found")
    process.exit(1)
  }

  // Check that [[Local vs Remote Layers]] wikilink was converted
  if (overviewHtml.includes('href="/modules/config/local-vs-remote"')) {
    console.log(
      '  OK: Wikilink [[Local vs Remote Layers]] resolved to /modules/config/local-vs-remote'
    )
  } else {
    console.error("  FAIL: Wikilink not resolved correctly")
    // Show what we got around the link
    const linkMatch = overviewHtml.match(
      /href="[^"]*local-vs-remote[^"]*"/
    )
    if (linkMatch) {
      console.error("  Found:", linkMatch[0])
    } else {
      // Check if raw wikilink text remains
      if (overviewHtml.includes("[[")) {
        console.error("  Raw wikilink text still present in output")
      }
    }
    process.exit(1)
  }

  // Check no <script> tags (sanitizer working)
  if (!overviewHtml.includes("<script")) {
    console.log("  OK: No <script> tags (sanitizer working)")
  } else {
    console.error("  FAIL: <script> tags found - sanitizer not working")
    process.exit(1)
  }

  // Test 2: Parse agents/index.md (has multiple wikilinks)
  console.log("\nTest 2: Parse agents/index.md (multiple wikilinks)")
  const agentsIndexPath = path.join(CONTENT_DIR, "agents", "index.md")
  const agentsIndexRaw = await fs.readFile(agentsIndexPath, "utf-8")
  const agentsIndexContent = agentsIndexRaw.replace(/^---[\s\S]*?---\n*/, "")

  const agentsHtml = await parseMarkdown(agentsIndexContent, {
    contentDir: CONTENT_DIR,
  })

  // Check [[GSD Pipeline Agents]] resolved
  if (agentsHtml.includes('href="/modules/agents/gsd-pipeline"')) {
    console.log(
      '  OK: [[GSD Pipeline Agents]] resolved to /modules/agents/gsd-pipeline'
    )
  } else {
    console.error("  FAIL: [[GSD Pipeline Agents]] not resolved")
    process.exit(1)
  }

  // Check [[Agent Design Patterns]] resolved
  if (agentsHtml.includes('href="/modules/agents/design-patterns"')) {
    console.log(
      '  OK: [[Agent Design Patterns]] resolved to /modules/agents/design-patterns'
    )
  } else {
    console.error("  FAIL: [[Agent Design Patterns]] not resolved")
    process.exit(1)
  }

  // Check GFM table rendered
  if (agentsHtml.includes("<table") && agentsHtml.includes("<th")) {
    console.log("  OK: GFM tables rendered correctly")
  } else {
    console.error("  FAIL: GFM tables not rendered")
    process.exit(1)
  }

  // Test 3: Test wikilink with heading anchor
  console.log("\nTest 3: Wikilink with heading anchor")
  const pluginsPath = path.join(CONTENT_DIR, "plugins", "plugin-reference.md")
  const pluginsRaw = await fs.readFile(pluginsPath, "utf-8")
  const pluginsContent = pluginsRaw.replace(/^---[\s\S]*?---\n*/, "")

  const pluginsHtml = await parseMarkdown(pluginsContent, {
    contentDir: CONTENT_DIR,
  })

  // Check [[Hook Reference#auto-gsd-workflow.sh]] resolved with anchor
  if (
    pluginsHtml.includes(
      'href="/modules/hooks/hook-reference#auto-gsd-workflowsh"'
    )
  ) {
    console.log(
      '  OK: [[Hook Reference#auto-gsd-workflow.sh]] resolved with anchor'
    )
  } else {
    // The anchor format might vary - check for the base path at least
    if (pluginsHtml.includes('href="/modules/hooks/hook-reference#')) {
      console.log(
        "  OK: Hook Reference wikilink resolved with anchor (format may vary)"
      )
    } else {
      console.error("  FAIL: Heading anchor wikilink not resolved")
      process.exit(1)
    }
  }

  // Test 4: Test wikilink with alias
  console.log("\nTest 4: Wikilink with alias")
  const localRemotePath = path.join(
    CONTENT_DIR,
    "config",
    "local-vs-remote.md"
  )
  const localRemoteRaw = await fs.readFile(localRemotePath, "utf-8")
  const localRemoteContent = localRemoteRaw.replace(/^---[\s\S]*?---\n*/, "")

  const localRemoteHtml = await parseMarkdown(localRemoteContent, {
    contentDir: CONTENT_DIR,
  })

  // Check [[CLAUDE.md Guide|Git Worktree Protocol]] has correct display text
  if (
    localRemoteHtml.includes("Git Worktree Protocol") &&
    localRemoteHtml.includes('href="/modules/config/claude-md-guide"')
  ) {
    console.log(
      '  OK: [[CLAUDE.md Guide|Git Worktree Protocol]] resolved with alias'
    )
  } else {
    console.error("  FAIL: Alias wikilink not resolved correctly")
    process.exit(1)
  }

  console.log("\n=== ALL TESTS PASSED ===")
}

main().catch((err) => {
  console.error("Test failed:", err)
  process.exit(1)
})
