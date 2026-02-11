"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    source: string;
    section: string;
  }>;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: `Hi! I'm the Splash at Yale assistant. I can help you find information from our guides and documentation.

Ask me things like:
• "How do teachers register on the website?"
• "What should I tell parents about lunch?"
• "Where do students check in on Splash day?"
• "How do we handle class cancellations?"`,
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          history,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantMessage += decoder.decode(value);
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          };
          return next;
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again or contact the Splash team for help.",
        },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <ScrollArea className="flex-1 p-3 sm:p-6">
        <div className="mx-auto max-w-3xl space-y-2">
          {messages.map((message, idx) => (
            <ChatMessage key={idx} {...message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-card border border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60" />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-foreground/60"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-foreground/60"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 border-t bg-background p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-2 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about Splash..."
              disabled={isLoading}
              className="flex-1 bg-card text-foreground text-base"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 sm:h-auto sm:w-auto"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}