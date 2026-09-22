import { Suspense } from "react";
import Link from "next/link";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { PixelBlastBackground } from "@/components/pixel-blast-wrapper";
import { HeroSection } from "@/components/hold";
import TextType from "@/components/testtype";
import { hasEnvVars } from "@/lib/utils";
import CardSwap, { Card } from "@/components/cardswap";
import { Stats2 } from "@/components/stats";
import { IntegrationsBeam } from "@/components/useflow";
import { SplineScene } from "@/components/robo";
import { AiBrain } from "@/components/aibrain";

const PramaanLogoIcon = () => (
  <svg
    viewBox="0 0 200 200"
    className="h-full w-full text-black fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M43.5 138.8L59.3 46.2C60.5 39 67.2 34 74.5 35.2L124.6 43.6C131.8 44.8 136.8 51.5 135.6 58.7L129.8 92.6C128.6 99.8 121.9 104.8 114.7 103.6L86.4 98.9L79.1 141.2C77.9 148.4 71.2 153.4 63.9 152.2L49.5 149.8C42.3 148.6 37.3 141.9 38.5 134.7L43.5 138.8Z" />
  </svg>
);

export default async function Home() {
  return (
    <main className="w-full bg-black text-white flex flex-col overflow-x-hidden">
      {/* SECTION 1: PixelBlast Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden">
        <PixelBlastBackground />

        <div className="relative z-10 w-full flex flex-col min-h-screen justify-between items-center">
          {/* Navigation Bar */}
          <nav className="w-full flex justify-center border-b border-zinc-800/50 h-16 bg-black/40 backdrop-blur-md">
            <div className="w-full max-w-7xl flex justify-between items-center p-3 px-4 sm:px-6 text-sm text-zinc-100">
              <Link
                href="/"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              >
                <div className="h-8 w-8 overflow-hidden rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                  <PramaanLogoIcon />
                </div>
                <span className="text-base font-bold tracking-tight text-white font-sans">
                  Pramaan
                </span>
              </Link>

              <div className="flex items-center">
                {!hasEnvVars ? (
                  <EnvVarWarning />
                ) : (
                  <Suspense>
                    <AuthButton />
                  </Suspense>
                )}
              </div>
            </div>
          </nav>

          <HeroSection />
        </div>
      </section>

      {/* SECTION 2: Integrations Beam */}
      <section className="relative z-20 w-full bg-black border-t border-zinc-800/40 py-24 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">
          One platform, every step covered
        </h2>
        <p className="text-zinc-400 text-lg mb-4 max-w-xl mx-auto">
          Pramaan AI ties search, documentation, and compliance together.
        </p>
        <IntegrationsBeam />
      </section>

      {/* SECTION 3: CardSwap Feature Section */}
      <section className="relative z-20 w-full bg-black border-t border-zinc-800/40 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="text-left max-w-md">
            <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-4">
              Built for accuracy,
              <br />
              trusted for certainty
            </h2>
            <TextType
              text={[
                "Empowering intelligent workflows with Pramaan AI.",
                "Deep reasoning, clean interactions, and modern design.",
                "Start building your next conversation today."
              ]}
              typingSpeed={45}
              deletingSpeed={25}
              pauseDuration={2200}
              loop={true}
              startOnVisible={true}
              className="text-base md:text-lg font-medium text-zinc-400"
              cursorCharacter="▋"
              cursorClassName="text-amber-400 font-bold"
            />
          </div>

          <div className="relative h-[420px] md:h-[480px] w-full flex items-center justify-center md:justify-end overflow-visible">
            <div className="relative md:translate-x-8 lg:translate-x-16">
              <CardSwap
                width={340}
                height={220}
                cardDistance={50}
                verticalDistance={55}
                delay={4000}
                pauseOnHover={true}
              >
                <Card customClass="p-6 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-white">Semantic Matching</h3>
                  <p className="text-sm text-zinc-400">
                    Finds the right Indian Standard by meaning, not keywords.
                  </p>
                </Card>
                <Card customClass="p-6 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-white">Allied Standards</h3>
                  <p className="text-sm text-zinc-400">
                    Surfaces normative, safety, and test-method references automatically.
                  </p>
                </Card>
                <Card customClass="p-6 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-white">Certification Info</h3>
                  <p className="text-sm text-zinc-400">
                    Flags BIS, CRS, and Hallmarking requirements up front.
                  </p>
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Original Interactive AI Companion (SplineScene Component) */}
      <section className="relative z-20 w-full bg-black border-t border-zinc-800/40 py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="w-full h-[500px] bg-zinc-950 rounded-2xl border border-zinc-800 relative overflow-hidden shadow-2xl">
            <div className="pointer-events-none absolute -top-40 left-0 md:left-60 md:-top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

            <div className="flex flex-col md:flex-row h-full relative z-10">
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  Interactive AI Companion
                </h2>
                <p className="mt-4 text-zinc-400 max-w-md text-base md:text-lg">
                  Experience intelligent reasoning in real time. Pramaan AI brings deep context and fluid interaction directly to your workflow.
                </p>
              </div>

              <div className="flex-1 relative h-full min-h-[300px]">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Additional 3D Diagram Section (Embedded Iframe) */}
      <section className="relative z-20 w-full bg-black border-t border-zinc-800/40 py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="w-full h-[500px] bg-zinc-950 rounded-2xl border border-zinc-800 relative overflow-hidden shadow-2xl">
            <div className="pointer-events-none absolute -top-40 right-0 md:right-60 md:-top-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="flex flex-col md:flex-row h-full relative z-10">
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  System Architecture Visualizer
                </h2>
                <p className="mt-4 text-zinc-400 max-w-md text-base md:text-lg">
                  Explore multi-layer standard mappings and automated compliance flows through a real-time spatial diagram.
                </p>
              </div>

              <div className="flex-1 relative h-full min-h-[300px] w-full">
                <iframe
                  src="https://my.spline.design/3ddiagram-VcOnr5i8Dz2Y5LytmThorA64/"
                  className="w-full h-full border-0"
                  title="System Architecture Diagram"
                />
              </div>
            </div>
          </div>
        </div>
       
      </section>
      {/* SECTION 1.5: Reasoning core — Spline AI brain */}
<section className="relative z-20 w-full bg-black border-t border-zinc-800/40 px-6 py-24">
  <div className="relative mx-auto max-w-5xl">
    <div className="relative h-[420px] md:h-[560px] w-full">
      <ErrorBoundary fallback={<div className="h-full w-full bg-zinc-950 rounded-2xl" />}>
      <AiBrain className="h-full w-full" />
        </ErrorBoundary>
    </div>

    <div className="relative md:absolute md:bottom-8 md:left-0 md:max-w-md rounded-2xl border border-zinc-800 bg-black/70 backdrop-blur-md p-6 mt-6 md:mt-0">
      <h2 className="text-2xl font-semibold text-white mb-2">
        Grounded reasoning, not guesswork
      </h2>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Every recommendation traces back to a retrieved BIS record. Pramaan
        reranks and reasons over real standards data — it never invents an
        IS number or a certification requirement.
      </p>
    </div>
  </div>
</section>

      {/* SECTION 6: Footer */}
      <footer className="relative z-20 w-full py-12 px-6 border-t border-zinc-800/40 bg-black text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3">
          <Stats2 />

          <p className="text-xs text-zinc-600 mt-2">
            © 2026 Pramaan AI
          </p>
        </div>
      </footer>
    </main>
  );
}
