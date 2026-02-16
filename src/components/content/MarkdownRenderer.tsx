/**
 * MarkdownRenderer component.
 *
 * Renders pre-sanitized HTML content that has been processed through
 * the parseMarkdown pipeline (which includes DOMPurify sanitization).
 *
 * SECURITY NOTE: The htmlContent prop contains HTML that was already
 * sanitized during build-time processing via isomorphic-dompurify in
 * the parser pipeline (CONT-05). This component is a Server Component
 * that renders the pre-sanitized HTML.
 */
export function MarkdownRenderer({ htmlContent }: { htmlContent: string }) {
  return (
    <div
      className="prose prose-slate dark:prose-invert max-w-none
        prose-headings:scroll-mt-20
        prose-code:before:content-[''] prose-code:after:content-['']
        prose-pre:overflow-x-auto prose-pre:rounded-lg
        prose-a:text-blue-600 dark:prose-a:text-blue-400
        prose-a:no-underline hover:prose-a:underline"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
