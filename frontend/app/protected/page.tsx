"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ClaudeChatInput } from "@/components/chat";
import { LogOut, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function ProtectedChatPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

// Reset the "Preparing your results..." screen whenever we (re)arrive here
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!session) {
        router.push("/auth/login");
      } else {
        setUser(session.user);
      }

      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session) {
        setUser(null);
        router.push("/auth/login");
      } else {
        setUser(session.user);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();

    router.refresh();
    router.push("/");
  };

  /*
   * Receives everything selected/entered in ClaudeChatInput.
   *
   * `query` is the final text for the API: typed text + pasted content
   * + contents of attached text files (built in chat.tsx).
   */
  const handleSendMessage = (data: {
    query: string;

    message: string;
    files: any[];
    pastedContent: any[];
    isThinkingEnabled: boolean;

    useProduct: boolean;
    productName: string;

    useDepartment: boolean;
    department: string;

    useScope: boolean;
    scopes: string[];
  }) => {
    console.log("Submitting payload with user ID:", user?.id, data);

    setIsNavigating(true);

    /*
     * Store the complete request in sessionStorage.
     *
     * The /protected/aichat page can read this later.
     */

    sessionStorage.setItem(
      "chat:lastRequest",
      JSON.stringify({
        query: data.query,

        message: data.message,

        files: data.files.map((file) => ({
          id: file.id,
          name: file.file?.name,
          type: file.file?.type,
          size: file.file?.size,
        })),

        pastedContent: data.pastedContent,

        isThinkingEnabled: data.isThinkingEnabled,

        useProduct: data.useProduct,
        productName: data.useProduct
          ? data.productName.trim()
          : "",

        useDepartment: data.useDepartment,
        department: data.useDepartment
          ? data.department.trim()
          : "",

        useScope: data.useScope,
        scopes: data.useScope
          ? data.scopes
          : [],
      })
    );

    /*
     * /protected/aichat reads this key and POSTs it to /recommend
     * as { query, retrieval_top_k: 30, final_top_k: 5 }.
     * It must be the combined query, not just the typed message.
     */
    sessionStorage.setItem(
      "chat:lastMessage",
      data.query
    );

    /*
     * Store individual values as well.
     * This makes it easy for the next page to retrieve them.
     */
    sessionStorage.setItem(
      "chat:productName",
      data.useProduct ? data.productName.trim() : ""
    );

    sessionStorage.setItem(
      "chat:department",
      data.useDepartment ? data.department.trim() : ""
    );

    sessionStorage.setItem(
      "chat:scope",
      data.useScope
        ? JSON.stringify(data.scopes)
        : JSON.stringify([])
    );

    router.push("/protected/aichat");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0d0e]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />

          <p className="text-sm font-medium text-zinc-400">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  if (isNavigating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0d0e]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />

          <p className="text-sm font-medium text-zinc-400">
            Preparing your results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0d0d0e] text-zinc-100">

      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-zinc-800 px-4 md:px-6">

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-sm font-semibold tracking-wide text-zinc-200">
            Workspace
          </span>
        </div>

        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
            <User className="h-3.5 w-3.5 text-zinc-400" />

            <span className="text-xs font-medium text-zinc-300">
              {user?.email || "User"}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            type="button"
          >
            <LogOut className="h-3.5 w-3.5" />

            <span>Sign out</span>
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-6">

        <div className="w-full max-w-4xl space-y-6">

          {/* Heading */}
          <div className="space-y-1.5 text-center">

            <h1 className="text-2xl font-semibold tracking-tight text-white">
              What would you like to explore today?
            </h1>

            <p className="text-xs text-zinc-400">
              Enter a prompt or upload content to begin.
            </p>

          </div>

          {/* Chatbox */}
          <ClaudeChatInput
            onSendMessage={handleSendMessage}
          />

        </div>
      </main>
    </div>
  );
}
