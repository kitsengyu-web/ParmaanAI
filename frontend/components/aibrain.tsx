// frontend/components/ai-brain.tsx
"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/loading";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner size={28} invert />
    </div>
  ),
});

interface AiBrainProps {
  className?: string;
}

export function AiBrain({ className }: AiBrainProps) {
  return (
    <Spline
      // Replace with your own exported scene URL (see Export → Code → React in Spline)
      scene="https://prod.spline.design/XXXXXXXX/scene.splinecode"
      className={className}
    />
  );
}
