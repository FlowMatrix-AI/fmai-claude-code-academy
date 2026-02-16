import DOMPurify from "isomorphic-dompurify"

/**
 * Sanitize HTML output from the markdown pipeline.
 *
 * Defense-in-depth: content is trusted (from our Obsidian vault),
 * but we sanitize anyway to prevent XSS if content is ever
 * user-contributed or if a parser bug introduces unsafe HTML.
 */
export function sanitizeHTML(htmlString: string): string {
  return DOMPurify.sanitize(htmlString, {
    ALLOWED_TAGS: [
      // Headings
      "h1", "h2", "h3", "h4", "h5", "h6",
      // Text
      "p", "a", "ul", "ol", "li", "dl", "dt", "dd",
      // Code
      "code", "pre",
      // Formatting
      "blockquote", "strong", "em", "del", "ins",
      // Tables
      "table", "thead", "tbody", "tr", "th", "td",
      // Media
      "img", "figure", "figcaption",
      // Structure (needed for syntax highlighting and callouts)
      "div", "span",
      // Misc
      "hr", "br",
      // Input (for GFM task lists)
      "input",
    ],
    ALLOWED_ATTR: [
      "href", "id", "class", "alt", "src", "title",
      // Accessibility
      "aria-label", "aria-hidden", "aria-describedby",
      "aria-expanded", "aria-controls", "role",
      // Syntax highlighting (rehype-pretty-code)
      "data-language", "data-theme", "data-rehype-pretty-code-figure",
      "data-rehype-pretty-code-title", "data-line", "data-highlighted-line",
      "data-highlighted-chars", "data-line-numbers",
      // Callout data attributes
      "data-callout", "data-callout-type",
      // Style for inline syntax highlighting
      "style",
      // Task list checkboxes
      "type", "checked", "disabled",
    ],
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  })
}
