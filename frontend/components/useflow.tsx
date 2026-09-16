"use client";

import { forwardRef, ReactNode, useRef } from "react";
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  Layers,
  Search,
  ShieldCheck,
} from "lucide-react";

import { AnimatedBeam } from "@/components/flow";
import { cn } from "@/lib/utils";

const PramaanLogoIcon = () => (
  <svg
    viewBox="0 0 200 200"
    className="h-full w-full text-black fill-current"
  >
    <path d="M43.5 138.8L59.3 46.2C60.5 39 67.2 34 74.5 35.2L124.6 43.6C131.8 44.8 136.8 51.5 135.6 58.7L129.8 92.6C128.6 99.8 121.9 104.8 114.7 103.6L86.4 98.9L79.1 141.2C77.9 148.4 71.2 153.4 63.9 152.2L49.5 149.8C42.3 148.6 37.3 141.9 38.5 134.7L43.5 138.8Z" />
  </svg>
);

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 p-3 shadow-[0_0_20px_-12px_rgba(255,255,255,0.25)]",
        className,
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

// A node with its icon and an outward-facing label.
// `side` controls whether the label sits before (left) or after (right) the icon,
// so labels always point away from the center and don't cross the beams.
function Node({
  refProp,
  icon,
  label,
  side,
}: {
  refProp: React.Ref<HTMLDivElement>;
  icon: ReactNode;
  label: string;
  side: "left" | "right";
}) {
  const labelEl = (
    <span
      className={cn(
        "text-xs sm:text-sm text-zinc-400 whitespace-nowrap",
        side === "left" ? "text-right" : "text-left",
      )}
    >
      {label}
    </span>
  );
  const circleEl = <Circle ref={refProp}>{icon}</Circle>;

  return (
    <div className="flex items-center gap-2.5">
      {side === "left" ? (
        <>
          {labelEl}
          {circleEl}
        </>
      ) : (
        <>
          {circleEl}
          {labelEl}
        </>
      )}
    </div>
  );
}

export function IntegrationsBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
  const midLeftRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const topRightRef = useRef<HTMLDivElement>(null);
  const midRightRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[380px] w-full max-w-3xl mx-auto items-center justify-center overflow-hidden"
    >
      <div className="flex size-full max-w-2xl mx-auto flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Node
            refProp={topLeftRef}
            side="left"
            label="Semantic Search"
            icon={<Search className="h-5 w-5 text-zinc-300" />}
          />
          <Node
            refProp={topRightRef}
            side="right"
            label="Document Analysis"
            icon={<FileText className="h-5 w-5 text-zinc-300" />}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <Node
            refProp={midLeftRef}
            side="left"
            label="Standards Library"
            icon={<Layers className="h-5 w-5 text-zinc-300" />}
          />
          <Circle ref={centerRef} className="h-14 w-14 border-none bg-white p-2.5">
            <PramaanLogoIcon />
          </Circle>
          <Node
            refProp={midRightRef}
            side="right"
            label="Certification"
            icon={<ShieldCheck className="h-5 w-5 text-zinc-300" />}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <Node
            refProp={bottomLeftRef}
            side="left"
            label="Compliance Checks"
            icon={<ClipboardCheck className="h-5 w-5 text-zinc-300" />}
          />
          <Node
            refProp={bottomRightRef}
            side="right"
            label="Reference Material"
            icon={<BookOpen className="h-5 w-5 text-zinc-300" />}
          />
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={topLeftRef}
        toRef={centerRef}
        curvature={-60}
        endYOffset={-10}
      />
      <AnimatedBeam containerRef={containerRef} fromRef={midLeftRef} toRef={centerRef} />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={bottomLeftRef}
        toRef={centerRef}
        curvature={60}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={topRightRef}
        toRef={centerRef}
        curvature={-60}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam containerRef={containerRef} fromRef={midRightRef} toRef={centerRef} reverse />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={bottomRightRef}
        toRef={centerRef}
        curvature={60}
        endYOffset={10}
        reverse
      />
    </div>
  );
}
