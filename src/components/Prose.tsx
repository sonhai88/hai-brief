import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Prose({ children }: { children: string }) {
  return (
    <div
      className="prose prose-invert max-w-none
        prose-headings:tracking-tight prose-headings:text-white
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-[17px] prose-p:leading-[1.75] prose-p:text-zinc-100
        prose-strong:text-white
        prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300 hover:prose-a:underline
        prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5
        prose-code:text-emerald-300 prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-zinc-900/80 prose-pre:border prose-pre:border-white/10
        prose-blockquote:border-l-emerald-400/60 prose-blockquote:text-zinc-200 prose-blockquote:not-italic
        prose-li:text-zinc-100 prose-li:my-1
        prose-hr:border-white/10"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
