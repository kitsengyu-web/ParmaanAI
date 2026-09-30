// frontend/app/protected/aichat/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { MessageList, type AgentMessage } from "@/components/aichat";
import { ClaudeChatInput } from "@/components/chat";

// Backend base URL. Set NEXT_PUBLIC_API_BASE_URL to override; otherwise the
// deployed Render backend is used.
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://pramaan-backend-cphc.onrender.com"
).replace(/\/$/, "");

interface Recommendation {
  standard_number: string;
  standard_name: string;
  relevance: string;
  explanation: string;
  certification: string | null;
  testing: string[];
  amendments: string[];
  relationships: string[];
}

interface RecommendationResponse {
  query: string;
  requirement_understanding: string;
  recommendations: Recommendation[];
  retrieved_standards: { standard_number: string; standard_name: string }[];
  notes: string[];
}

function formatResponse(data: RecommendationResponse): string {
  const out: string[] = [];

  out.push(data.requirement_understanding);

  if (data.recommendations.length > 0) {
    out.push("", "## Recommended standards");

    data.recommendations.forEach((rec, i) => {
      out.push(
        "",
        `### ${i + 1}. ${rec.standard_number}`,
        `*${rec.standard_name}*`,
        "",
        `**Relevance:** ${rec.relevance}`,
        "",
        rec.explanation,
      );

      if (rec.certification) {
        out.push("", `**Certification:** ${rec.certification}`);
      }
      if (rec.testing.length) {
        out.push("", "**Testing:**", ...rec.testing.map((t) => `- ${t}`));
      }
      if (rec.amendments.length) {
        out.push("", "**Amendments:**", ...rec.amendments.map((a) => `- ${a}`));
      }
      if (rec.relationships.length) {
        out.push("", "**Related standards:**", ...rec.relationships.map((r) => `- ${r}`));
      }

      if (i < data.recommendations.length - 1) out.push("", "---");
    });
  } else {
    out.push("", "No relevant standards were found for this query.");
  }

  if (data.notes.length) {
    out.push("", "## Notes", ...data.notes.map((n) => `- ${n}`));
  }

  return out.join("\n");
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${Date.now()}-${idCounter}`;
}

export default function AiChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const initializedRef = useRef(false);

  const handleNewChat = useCallback(() => {
    abortRef.current?.abort();
    sessionStorage.removeItem("chat:lastMessage");
    sessionStorage.removeItem("chat:lastRequest");
    router.push("/protected");
  }, [router]);

  const sendQuery = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // POST { query, retrieval_top_k: 30, final_top_k: 5 }
      const res = await fetch(`${API_BASE_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          retrieval_top_k: 30,
          final_top_k: 5,
        }),
        signal: controller.signal,
      });

      // Render may return a non-JSON error page (e.g. 502 while waking up).
      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        /* non-JSON body */
      }

      if (!res.ok) {
        const detail =
          data && typeof data === "object" && "detail" in data
            ? String((data as { detail?: unknown }).detail)
            : `Server responded with status ${res.status}.`;

        const title =
          res.status === 404
            ? "No relevant standards found"
            : res.status === 503
              ? "Service unavailable"
              : res.status === 400
                ? "Invalid request"
                : "Request failed";

        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", parts: [{ type: "error", title, message: detail }] },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          parts: [{ type: "text", text: formatResponse(data as RecommendationResponse) }],
        },
      ]);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          parts: [
            {
              type: "error",
              title: "Connection error",
              message: err instanceof Error ? err.message : "Could not reach the backend.",
            },
          ],
        },
      ]);
    }
  }, []);

  // Called by ClaudeChatInput on submit. `query` is the combined text
  // (typed + pasted + Product/Department/Scope lines).
  const handleSendMessage = useCallback(
    (data: { query: string }) => {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", parts: [{ type: "text", text: data.query }] },
      ]);
      void sendQuery(data.query);
    },
    [sendQuery],
  );

  // Pick up the combined query stashed by /protected before it routed here.
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const stashed = sessionStorage.getItem("chat:lastMessage");
    if (stashed) {
      sessionStorage.removeItem("chat:lastMessage");
      setMessages([{ id: nextId(), role: "user", parts: [{ type: "text", text: stashed }] }]);
      void sendQuery(stashed);
    }
  }, [sendQuery]);

  return (
    <div className="flex h-screen flex-col bg-[#0d0d0e] text-zinc-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 px-4 md:px-6">
        <span className="text-sm font-semibold tracking-wide text-zinc-200">
          Pramaan Assistant
        </span>

        <button
          type="button"
          onClick={handleNewChat}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New chat</span>
        </button>
      </header>

      <MessageList messages={messages} />

      <div className="shrink-0 px-3 pb-3">
        <ClaudeChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
