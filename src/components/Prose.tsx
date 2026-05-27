import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Reading-optimized prose: light cream bg, Lora serif body, max width 65ch.
 * Tone Substack/Medium/Stratechery — long-form đọc thoải mái, không mỏi mắt.
 */
export function Prose({ children }: { children: string }) {
  return (
    <div
      className="prose prose-stone max-w-none font-serif
        prose-headings:font-sans prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-stone-900
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-3
        prose-p:text-[19px] prose-p:leading-[1.85] prose-p:text-stone-800 prose-p:my-6
        prose-strong:text-stone-900 prose-strong:font-semibold
        prose-em:text-stone-700
        prose-a:text-emerald-700 prose-a:font-medium prose-a:underline prose-a:decoration-emerald-700/30
        prose-a:underline-offset-[3px] hover:prose-a:decoration-emerald-700
        prose-code:font-sans prose-code:rounded prose-code:bg-emerald-50 prose-code:px-1.5 prose-code:py-0.5
        prose-code:text-emerald-800 prose-code:font-medium prose-code:text-[0.92em]
        prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-stone-100 prose-pre:border prose-pre:border-stone-200 prose-pre:text-stone-800
        prose-blockquote:border-l-emerald-600 prose-blockquote:font-serif prose-blockquote:text-stone-700 prose-blockquote:not-italic
        prose-li:text-stone-800 prose-li:text-[19px] prose-li:leading-[1.8] prose-li:my-2
        prose-hr:border-stone-200 prose-hr:my-10"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
