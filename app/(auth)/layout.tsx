import React from "react";
import Link from "next/link";
import { ShieldAlert, FileText, Zap } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-background text-foreground overflow-hidden">
      {/* Left Pane: Forms */}
      <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative z-10">
        <div className="absolute top-8 left-8">
          <Link href="/" className="cursor-pointer">
            <Logo />
          </Link>
        </div>
        <div className="max-w-md w-full mx-auto">{children}</div>
      </div>

      {/* Right Pane: Brand Gradients */}
      <div className="hidden lg:col-span-6 lg:flex flex-col justify-between p-16 bg-gradient-to-tr from-primary via-indigo-900 to-zinc-950 relative overflow-hidden">
        {/* Vector glows */}
        <div className="absolute inset-0 bg-grid-white/[0.02] z-0" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2 select-none">
          <Logo className="h-10 w-auto" showText={false} />
          <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
            Pafyra<span className="text-emerald-400">.</span>
          </span>
        </div>

        {/* Feature pitch in Auth screen */}
        <div className="relative z-10 flex flex-col gap-6 max-w-lg mb-8 select-none">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
            The developer first platform for flawless HTML to PDF compiles.
          </h2>
          <p className="text-white/80 text-base leading-relaxed">
            Configure secure API keys, submit dynamic HTML files, and download print-compliant PDFs shaped for global compliance.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-4 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl font-bold text-white tracking-tight">1.2s</span>
              <span className="text-xs text-white/60 font-semibold uppercase tracking-wider">Average compile speed</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl font-bold text-white tracking-tight">100%</span>
              <span className="text-xs text-white/60 font-semibold uppercase tracking-wider">Arabic Shaping Accuracy</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50 font-semibold">
          © {new Date().getFullYear()} Pafyra. All rights reserved.
        </div>
      </div>
    </div>
  );
}
