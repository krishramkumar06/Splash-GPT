import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    source: string;
    section: string;
  }>;
}

export function ChatMessage({ role, content, sources }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "mb-4 flex",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          role === "user"
            ? "bg-yaleBlue text-white"
            : "bg-card border border-border"
        )}
      >
        <div
          className={cn(
            "prose prose-sm max-w-none",
            role === "user" ? "text-white" : "text-foreground",
            role === "user" && "prose-invert"
          )}
        >
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className={cn(
                    "font-medium underline decoration-2 hover:no-underline transition-colors",
                    role === "user"
                      ? "text-blue-200 hover:text-blue-100"
                      : "text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
              ul: ({ node, ...props }) => <ul {...props} className="mb-2 ml-4 list-disc" />,
              ol: ({ node, ...props }) => <ol {...props} className="mb-2 ml-4 list-decimal" />,
              li: ({ node, ...props }) => <li {...props} className="mb-1" />,
              strong: ({ node, ...props }) => (
                <strong {...props} className="font-semibold" />
              ),
              code: ({ node, ...props }) => (
                <code
                  {...props}
                  className={cn(
                    "rounded px-1 py-0.5 font-mono text-sm",
                    role === "user" ? "bg-blue-800" : "bg-secondary"
                  )}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        {sources && sources.length > 0 && (
          <div className="mt-3 border-t border-border pt-2 text-xs text-muted-foreground">
            <p className="font-semibold">Sources:</p>
            <ul className="mt-1 space-y-1">
              {sources.map((source, idx) => (
                <li key={idx}>
                  • {source.source} - {source.section}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
