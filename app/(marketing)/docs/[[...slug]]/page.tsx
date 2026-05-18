"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  Terminal,
  Search,
  AlertTriangle,
  Info,
  Copy,
  Check,
  ChevronLeft,
  Settings,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DOCS_NAV } from "@/lib/constants";
import { CopyButton } from "@/components/shared/CopyButton";

// Docs articles database
const DOCS_CONTENT: Record<
  string,
  {
    title: string;
    description: string;
    category: string;
    content: React.ReactNode;
    prev?: { title: string; href: string };
    next?: { title: string; href: string };
  }
> = {
  introduction: {
    title: "Introduction to Pafyra",
    category: "Getting Started",
    description: "Learn how Pafyra generates beautiful, production-ready PDFs from HTML at scale.",
    content: (
      <div className="flex flex-col gap-6 text-foreground/90">
        <p className="text-base leading-relaxed">
          Welcome to the **Pafyra API documentation**! Pafyra is an enterprise-grade HTML-to-PDF generation microservice designed for developers. We solve the hard problems of PDF layouts, dynamic styling, async task queueing, and professional RTL/Arabic typographical shaping.
        </p>

        <div className="my-2 p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed text-foreground/80">
            <strong>Why Pafyra?</strong> Most generic PDF engines generate broken letters when compiling Arabic text (rendering disconnected glyps or reversing the sequence). Pafyra automatically reshapes and supports premium local fonts like Tajawal and Amiri with zero setup required.
          </div>
        </div>

        <h3 className="text-xl font-bold mt-4">Core Infrastructure</h3>
        <ul className="list-disc pl-6 flex flex-col gap-2.5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-foreground">Scale Ready:</strong> Jobs are enqueued instantly into an in-memory Redis buffer and distributed sequentially to headless Puppeteer instances.
          </li>
          <li>
            <strong className="text-foreground">Isolated sandboxing:</strong> Heavy chrome processes are fully isolated to ensure server stability.
          </li>
          <li>
            <strong className="text-foreground">Full Metrics Audit:</strong> Track generation durations, compiled page sizes, and specific usage logs per key.
          </li>
        </ul>
      </div>
    ),
    next: { title: "Quick Start", href: "/docs/quick-start" },
  },

  "quick-start": {
    title: "Quick Start Guide",
    category: "Getting Started",
    description: "Get your first PDF generated in under 2 minutes.",
    content: (
      <div className="flex flex-col gap-6 text-foreground/90">
        <p className="text-sm md:text-base leading-relaxed">
          Follow this guide to set up your account, obtain credentials, and run your first PDF render.
        </p>

        <h3 className="text-lg font-bold flex items-center gap-2 mt-4">
          <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
          Register & Retrieve API Key
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Go to <Link href="/register" className="text-primary hover:underline">Register</Link> to create a free account. Navigate to **API Keys** in your dashboard, click **Create Key**, and copy the generated secret key. It will be styled like: <code className="font-mono text-xs bg-muted/80 px-1.5 py-0.5 rounded text-primary">pfy_live_abc123...</code>.
        </p>

        <h3 className="text-lg font-bold flex items-center gap-2 mt-4">
          <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
          Submit rendering job
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground mb-1">
          Perform a POST request containing your target HTML code. Replace <code className="font-mono text-xs bg-muted/80 px-1 rounded">YOUR_KEY</code> with your copied token:
        </p>

        <div className="relative rounded-xl overflow-hidden border border-border/80 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
          <div className="absolute top-3 right-3">
            <CopyButton value={`curl -X POST https://api.pafyra.com/api/v1/pdf/generate \\\n  -H "x-api-key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"html": "<h1>Hello Pafyra</h1>", "format": "A4"}'`} />
          </div>
          <pre className="overflow-x-auto whitespace-pre pr-8">
{`curl -X POST https://api.pafyra.com/api/v1/pdf/generate \\
  -H "x-api-key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Hello Pafyra</h1>", "format": "A4"}'`}
          </pre>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          The API enqueues the job instantly and responds with a transaction ID:
        </p>
        <div className="rounded-xl border border-border/80 bg-zinc-950/80 p-4 font-mono text-xs text-emerald-500">
          <pre>{`{"jobId": "6f1ae53e-8ca4-4795-b2b9-fb921d4513f7"}`}</pre>
        </div>

        <h3 className="text-lg font-bold flex items-center gap-2 mt-4">
          <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
          Poll for completed PDF
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground mb-1">
          Check status to obtain the final download URL link:
        </p>

        <div className="relative rounded-xl overflow-hidden border border-border/80 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
          <div className="absolute top-3 right-3">
            <CopyButton value={`curl https://api.pafyra.com/api/v1/pdf/status/6f1ae53e-8ca4-4795-b2b9-fb921d4513f7 \\\n  -H "x-api-key: YOUR_KEY"`} />
          </div>
          <pre className="overflow-x-auto whitespace-pre pr-8">
{`curl https://api.pafyra.com/api/v1/pdf/status/6f1ae53e-8ca4-4795-b2b9-fb921d4513f7 \\
  -H "x-api-key: YOUR_KEY"`}
          </pre>
        </div>
      </div>
    ),
    prev: { title: "Introduction", href: "/docs/introduction" },
    next: { title: "Authentication", href: "/docs/authentication" },
  },

  authentication: {
    title: "Authentication",
    category: "Getting Started",
    description: "Securely validate your programmatic API calls.",
    content: (
      <div className="flex flex-col gap-6 text-foreground/90">
        <p className="text-sm md:text-base leading-relaxed">
          The Pafyra Core API secures all programmatic generation endpoints utilizing custom SHA-256 encrypted API tokens.
        </p>

        <h3 className="text-lg font-bold mt-4">Header configuration</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All client-side calls to <code className="font-mono text-xs bg-muted/80 px-1 rounded text-primary">/api/v1/**</code> must supply your active key inside the custom <code className="font-mono text-xs bg-muted/80 px-1 rounded font-bold">x-api-key</code> HTTP header:
        </p>

        <div className="rounded-xl border border-border/80 bg-zinc-950/80 p-4 font-mono text-xs text-zinc-300 leading-relaxed">
          <div>x-api-key: pfy_live_abc123xyz78910QWERTYUIOP</div>
          <div>Content-Type: application/json</div>
        </div>

        <div className="my-2 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed text-foreground/80">
            <strong>Key safety reminder:</strong> Your API secret key is shown ONLY ONCE upon creation dialog confirmation. Always store it in secure local configuration environments (like <code className="font-mono text-xs bg-muted/60 px-1 py-0.5 rounded">.env</code>). If compromised, revoke it immediately inside the dashboard keys panel.
          </div>
        </div>
      </div>
    ),
    prev: { title: "Quick Start", href: "/docs/quick-start" },
    next: { title: "Generate PDF Reference", href: "/docs/generate-pdf" },
  },

  "generate-pdf": {
    title: "POST /api/v1/pdf/generate",
    category: "API Reference",
    description: "Submit a raw HTML string layout to be enqueued for PDF compilation.",
    content: (
      <div className="flex flex-col gap-6 text-foreground/90">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded">POST</span>
          <code className="font-mono text-xs bg-muted px-2 py-1 rounded text-primary font-bold">/api/v1/pdf/generate</code>
        </div>

        <h3 className="text-lg font-bold mt-4">Payload Options</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-collapse border border-border/60 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-muted/40 font-semibold border-b border-border/60">
                <th className="p-3">Parameter</th>
                <th className="p-3">Type</th>
                <th className="p-3">Required</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-muted-foreground">
              <tr>
                <td className="p-3 font-semibold text-foreground font-mono">html</td>
                <td className="p-3 font-mono text-xs">String</td>
                <td className="p-3 text-emerald-500 font-bold">Yes</td>
                <td className="p-3 leading-relaxed text-xs">HTML string to compile (max 1MB payload size limit).</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-foreground font-mono">format</td>
                <td className="p-3 font-mono text-xs">String</td>
                <td className="p-3">No</td>
                <td className="p-3 leading-relaxed text-xs">Defaults to <code className="bg-muted px-1 rounded">A4</code>. Options: <code className="bg-muted px-1 rounded">A4</code>, <code className="bg-muted px-1 rounded">LETTER</code>, <code className="bg-muted px-1 rounded">LEGAL</code>.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-foreground font-mono">orientation</td>
                <td className="p-3 font-mono text-xs">String</td>
                <td className="p-3">No</td>
                <td className="p-3 leading-relaxed text-xs">Defaults to <code className="bg-muted px-1 rounded">PORTRAIT</code>. Options: <code className="bg-muted px-1 rounded">PORTRAIT</code>, <code className="bg-muted px-1 rounded">LANDSCAPE</code>.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-foreground font-mono">language</td>
                <td className="p-3 font-mono text-xs">String</td>
                <td className="p-3">No</td>
                <td className="p-3 leading-relaxed text-xs">Set to <code className="bg-muted px-1 rounded">ar</code> to explicitly trigger the Arabic RTL typographical shape rules.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    prev: { title: "Authentication", href: "/docs/authentication" },
    next: { title: "Job Status Reference", href: "/docs/job-status" },
  },

  "job-status": {
    title: "GET /api/v1/pdf/status/{jobId}",
    category: "API Reference",
    description: "Retrieve status or the final download link of your PDF job.",
    content: (
      <div className="flex flex-col gap-6 text-foreground/90">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded">GET</span>
          <code className="font-mono text-xs bg-muted px-2 py-1 rounded text-primary font-bold">/api/v1/pdf/status/{"{jobId}"}</code>
        </div>

        <h3 className="text-lg font-bold mt-4">Response Schemas</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          While enqueued in the Redis queue or being parsed, the status will show <code className="font-mono bg-muted/80 px-1 rounded text-amber-500">queued</code> or <code className="font-mono bg-muted/80 px-1 rounded text-blue-500">processing</code>:
        </p>

        <div className="rounded-xl border border-border/80 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
          <pre>{`{\n  "jobId": "6f1ae53e-8ca4-4795-b2b9-fb921d4513f7",\n  "status": "processing"\n}`}</pre>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          Once successfully rendered, it responds with size and download link parameters:
        </p>

        <div className="rounded-xl border border-border/80 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
          <pre>{`{\n  "jobId": "6f1ae53e-8ca4-4795-b2b9-fb921d4513f7",\n  "status": "done",\n  "size": 88798,\n  "durationMs": 1400,\n  "downloadUrl": "http://localhost:4000/files/6f1ae53e-8ca4-4795-b2b9-fb921d4513f7.pdf"\n}`}</pre>
        </div>
      </div>
    ),
    prev: { title: "Generate PDF", href: "/docs/generate-pdf" },
    next: { title: "Arabic & RTL PDFs Guide", href: "/docs/arabic-rtl" },
  },

  "arabic-rtl": {
    title: "Arabic & RTL PDFs",
    category: "Guides",
    description: "Learn how Pafyra handles dynamic RTL structures and embeds standard fonts.",
    content: (
      <div className="flex flex-col gap-6 text-foreground/90">
        <p className="text-sm md:text-base leading-relaxed">
          Standard HTML-to-PDF engines fail to handle the complex layout flow and glyph connections of Arabic text, showing backward disconnected alphabets.
        </p>

        <h3 className="text-lg font-bold mt-4 flex items-center gap-2">
          <span className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">ar</span> Auto-Language Detection
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Whenever Arabic characters are detected inside the HTML string, or if you explicitly supply <code className="font-mono text-xs bg-muted/80 px-1 rounded text-primary">"language": "ar"</code> inside your POST payload, our Puppeteer rendering worker automatically injects standard CSS rules to force alignment:
        </p>

        <div className="rounded-xl border border-border/80 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
          <pre>{`body {\n  direction: rtl !important;\n  text-align: right !important;\n}`}</pre>
        </div>

        <h3 className="text-lg font-bold mt-4 flex items-center gap-2">
          <FileCode className="h-5 w-5 text-primary" /> Premium Local Font Families
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We bundle premium local typography by default inside the sandboxed Chromium worker:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2 text-sm text-muted-foreground leading-relaxed">
          <li><strong className="text-foreground">Tajawal:</strong> Premium sans-serif font ideal for corporate reports.</li>
          <li><strong className="text-foreground">Cairo:</strong> Modern geometric sans-serif suitable for headings.</li>
          <li><strong className="text-foreground">Amiri:</strong> Classic serif typeface styled for official letters and documentation.</li>
        </ul>
      </div>
    ),
    prev: { title: "Job Status Reference", href: "/docs/job-status" },
  },
};

export default function DocsPage() {
  const router = useRouter();
  const params = useParams();
  const slugArray = params?.slug as string[];
  const slug = slugArray && slugArray.length > 0 ? slugArray[0] : "introduction";

  const [searchQuery, setSearchQuery] = useState("");
  const currentDoc = DOCS_CONTENT[slug] || DOCS_CONTENT["introduction"];

  // Search filter
  const searchResults = Object.keys(DOCS_CONTENT)
    .filter((key) => {
      const doc = DOCS_CONTENT[key];
      return (
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .map((key) => ({ slug: key, ...DOCS_CONTENT[key] }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* ────────────────── LEFT SIDEBAR NAVIGATION ────────────────── */}
      <aside className="lg:col-span-3 flex flex-col gap-6 sticky top-24 self-start max-h-[80vh] overflow-y-auto pr-4">
        {/* Simple Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
          <Input
            placeholder="Search docs... (e.g. RTL)"
            className="pl-10 rounded-lg text-sm bg-muted/40 border-border/80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery ? (
          /* Search Results Pane */
          <div className="flex flex-col gap-2 bg-muted/20 p-3 rounded-xl border border-border/60">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Search Results</span>
            {searchResults.length > 0 ? (
              searchResults.map((res) => (
                <Link
                  key={res.slug}
                  href={`/docs/${res.slug}`}
                  onClick={() => setSearchQuery("")}
                  className="text-sm font-medium text-muted-foreground hover:text-primary px-2 py-1.5 rounded-lg hover:bg-muted/80 block"
                >
                  {res.title}
                </Link>
              ))
            ) : (
              <span className="text-xs text-muted-foreground/60 p-2 italic">No articles found</span>
            )}
          </div>
        ) : (
          /* Default Docs Nav Menu */
          <div className="flex flex-col gap-6 select-none">
            {DOCS_NAV.map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <h4 className="text-[11px] font-extrabold tracking-widest text-foreground uppercase">
                  {cat.title}
                </h4>
                <ul className="flex flex-col gap-1 border-l border-border/60 pl-3">
                  {cat.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${item.slug}`}
                        className={`text-sm font-semibold transition-colors hover:text-primary block py-1 ${
                          slug === item.slug
                            ? "text-primary border-l-2 border-primary -ml-[14px] pl-[12px]"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ────────────────── RIGHT CONTENT AREA ────────────────── */}
      <main className="lg:col-span-9 flex flex-col gap-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
          <BookOpen className="h-3.5 w-3.5" /> Docs
          <ChevronRight className="h-3 w-3" /> {currentDoc.category}
          <ChevronRight className="h-3 w-3" /> <span className="text-foreground">{currentDoc.title}</span>
        </div>

        {/* Content Heading */}
        <div className="border-b border-border/60 pb-6">
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-2">
            {currentDoc.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {currentDoc.description}
          </p>
        </div>

        {/* Article Body */}
        <article className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed">
          {currentDoc.content}
        </article>

        {/* Dynamic Previous/Next Nav Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border/60 mt-12 pt-8 select-none">
          {currentDoc.prev ? (
            <Link href={currentDoc.prev.href}>
              <Card className="p-4 border border-border/60 bg-card/40 hover:border-primary/40 hover:bg-muted/10 transition-all flex items-center gap-4 text-left cursor-pointer group">
                <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Previous</span>
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{currentDoc.prev.title}</span>
                </div>
              </Card>
            </Link>
          ) : (
            <div />
          )}

          {currentDoc.next ? (
            <Link href={currentDoc.next.href}>
              <Card className="p-4 border border-border/60 bg-card/40 hover:border-primary/40 hover:bg-muted/10 transition-all flex items-center gap-4 text-right justify-end cursor-pointer group">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Next</span>
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{currentDoc.next.title}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </Card>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}
