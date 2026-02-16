import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeSlug from "rehype-slug"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeStringify from "rehype-stringify"
import type { Plugin } from "unified"
import type { Root, Text, Link } from "mdast"
import { visit } from "unist-util-visit"
import { buildPermalinkMap, headingToAnchor } from "./obsidian"
import { sanitizeHTML } from "./sanitizer"

/**
 * Custom remark plugin to convert Obsidian wikilinks to standard markdown links.
 *
 * Handles three wikilink patterns found in the FMAI content:
 *   1. Simple:        [[Architecture Overview]]
 *   2. With anchor:   [[Hook Reference#auto-gsd-workflow.sh]]
 *   3. With alias:    [[CLAUDE.md Guide|Git Worktree Protocol]]
 *
 * Converts them to standard markdown links:
 *   [Architecture Overview](/modules/architecture/overview)
 *   [auto-gsd-workflow.sh](/modules/hooks/hook-reference#auto-gsd-workflowsh)
 *   [Git Worktree Protocol](/modules/config/claude-md-guide)
 */
function remarkWikiLinks(
  permalinkMap: Record<string, string>
): Plugin<[], Root> {
  return () => {
    return (tree: Root) => {
      visit(tree, "text", (node: Text, index, parent) => {
        if (!parent || index === undefined) return

        const text = node.value
        // Match wikilinks: [[target]], [[target#heading]], [[target|alias]]
        // Also handles combinations like [[target#heading|alias]]
        const wikiLinkRegex = /\[\[([^\]]+?)\]\]/g
        let match
        const parts: Array<Text | Link> = []
        let lastIndex = 0

        while ((match = wikiLinkRegex.exec(text)) !== null) {
          // Add text before the match
          if (match.index > lastIndex) {
            parts.push({
              type: "text",
              value: text.slice(lastIndex, match.index),
            })
          }

          const fullMatch = match[1]

          // Parse the wikilink components
          let target: string
          let heading: string | null = null
          let alias: string | null = null

          // Check for alias (pipe syntax)
          const pipeIndex = fullMatch.indexOf("|")
          if (pipeIndex !== -1) {
            target = fullMatch.slice(0, pipeIndex)
            alias = fullMatch.slice(pipeIndex + 1)
          } else {
            target = fullMatch
          }

          // Check for heading anchor (hash syntax)
          const hashIndex = target.indexOf("#")
          if (hashIndex !== -1) {
            heading = target.slice(hashIndex + 1)
            target = target.slice(0, hashIndex)
          }

          // Resolve the target to a URL
          const route = permalinkMap[target.trim()]
          let url: string
          if (route) {
            url = `/modules/${route}`
            if (heading) {
              url += `#${headingToAnchor(heading)}`
            }
          } else {
            // Unresolved wikilink - log warning and create a broken link
            console.warn(`Unresolved wikilink: [[${fullMatch}]]`)
            url = "#"
          }

          // Determine display text
          let displayText: string
          if (alias) {
            displayText = alias.trim()
          } else if (heading && !target) {
            displayText = heading
          } else if (heading) {
            displayText = heading
          } else {
            displayText = target.trim()
          }

          // Create a link node
          const linkNode: Link = {
            type: "link",
            url,
            title: null,
            children: [{ type: "text", value: displayText }],
          }

          parts.push(linkNode)
          lastIndex = match.index + match[0].length
        }

        // If we found any wikilinks, replace the text node with the parts
        if (parts.length > 0) {
          // Add remaining text after last match
          if (lastIndex < text.length) {
            parts.push({
              type: "text",
              value: text.slice(lastIndex),
            })
          }

          // Replace the current node with the new parts
          parent.children.splice(index, 1, ...parts)
        }
      })
    }
  }
}

/**
 * Parse markdown content to sanitized HTML.
 *
 * Pipeline:
 *   1. remarkParse - parse markdown to AST
 *   2. remarkGfm - GitHub Flavored Markdown (tables, strikethrough, task lists)
 *   3. remarkWikiLinks - convert Obsidian [[wikilinks]] to standard links
 *   4. remarkRehype - bridge to HTML AST
 *   5. rehypeSlug - add IDs to headings for deep linking
 *   6. rehypePrettyCode - syntax highlighting with github-dark theme
 *   7. rehypeStringify - serialize to HTML string
 *   8. sanitizeHTML - DOMPurify sanitization (defense-in-depth)
 */
export async function parseMarkdown(
  content: string,
  options: { contentDir: string }
): Promise<string> {
  try {
    // Build permalink map for wikilink resolution
    const permalinkMap = await buildPermalinkMap(options.contentDir)

    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkWikiLinks(permalinkMap))
      .use(remarkRehype, { allowDangerousHtml: false })
      .use(rehypeSlug)
      .use(rehypePrettyCode, {
        theme: "github-dark",
        keepBackground: false,
      })
      .use(rehypeStringify)

    const result = await processor.process(content)
    const htmlString = String(result)

    // Sanitize before returning (CONT-05)
    return sanitizeHTML(htmlString)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown parsing error"
    console.error("Markdown parsing error:", message)
    return `<div class="parse-error"><p><strong>Error parsing content:</strong> ${message}</p></div>`
  }
}
