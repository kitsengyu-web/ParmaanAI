// frontend/app/protected/aichat/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageList, type AgentMessage } from "@/components/aichat";
import { ClaudeChatInput } from "@/components/chat";

// Backend base URL. Set NEXT_PUBLIC_API_BASE_URL to override; otherwise the
// deployed Render backend is used. (The old NEXT_PUBLIC_API_URL localhost
// fallback was removed so a stale .env.local value can't override Render.)
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
  const lines: string[] = [data.requirement_understanding];

  if (data.recommendations.length > 0) {
    lines.push("", "Recommended standards:");
    data.recommendations.forEach((rec, i) => {
      lines.push(
        `${i + 1}. ${rec.standard_number} — ${rec.standard_name} (${rec.relevance})`,
      );
      lines.push(`   ${rec.explanation}`);
      if (rec.certification) lines.push(`   Certification: ${rec.certification}`);
      if (rec.testing.length) lines.push(`   Testing: ${rec.testing.join(", ")}`);
      if (rec.amendments.length) lines.push(`   Amendments: ${rec.amendments.join(", ")}`);
      if (rec.relationships.length) lines.push(`   Related: ${rec.relationships.join(", ")}`);
    });
  } else {
    lines.push("", "No relevant standards were found for this query.");
  }

  if (data.notes.length) {
    lines.push("", "Notes:");
    data.notes.forEach((n) => lines.push(`- ${n}`));
  }

  return lines.join("\n");
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${Date.now()}-${idCounter}`;
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const initializedRef = useRef(false);

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

  // Pick up the combined query (text + pasted + file contents) stashed by
  // /protected before it routed here.
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
      <header className="flex h-14 shrink-0 items-center border-b border-zinc-800 px-4 md:px-6">
        <span className="text-sm font-semibold tracking-wide text-zinc-200">
          Pramaan Assistant
        </span>
      </header>

      <MessageList messages={messages} />

      <div className="shrink-0 px-3 pb-3">
        <ClaudeChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
