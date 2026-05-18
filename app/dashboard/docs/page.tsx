"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Terminal,
  KeyRound,
  FileText,
  Zap,
  Copy,
  CheckCircle,
  ChevronRight,
  Globe,
  Lock,
  AlertCircle,
  Code2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useApiKeys } from "@/hooks/useApiKeys";
import Link from "next/link";

// ─── Code block with copy ────────────────────────────────────────────────────
function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl bg-[#0d0d14] border border-border/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-muted/10">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{language}</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 rounded text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <pre className="p-4 text-xs text-foreground/90 font-mono leading-relaxed overflow-x-auto whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Section anchor header ────────────────────────────────────────────────────
function SectionHeader({ id, icon, title, description }: { id: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div id={id} className="flex flex-col gap-1.5 scroll-mt-8">
      <div className="flex items-center gap-2.5 text-foreground font-bold text-lg">
        <span className="text-primary">{icon}</span>
        {title}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

// ─── HTTP Method badge ────────────────────────────────────────────────────────
function MethodBadge({ method }: { method: "GET" | "POST" | "DELETE" | "PATCH" }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    POST: "bg-primary/10 text-primary border-primary/20",
    DELETE: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    PATCH: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };
  return (
    <Badge variant="outline" className={`rounded font-mono text-[10px] font-extrabold px-2 py-0.5 ${colors[method]}`}>
      {method}
    </Badge>
  );
}

// ─── Endpoint card ────────────────────────────────────────────────────────────
function EndpointCard({
  method,
  path,
  description,
  auth,
  params,
  responseExample,
  requestExample,
}: {
  method: "GET" | "POST" | "DELETE" | "PATCH";
  path: string;
  description: string;
  auth: "api-key" | "jwt" | "none";
  params?: { name: string; type: string; required: boolean; description: string }[];
  requestExample?: string;
  responseExample: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border/70 rounded-xl overflow-hidden bg-card/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 hover:bg-muted/20 transition-colors text-left"
      >
        <MethodBadge method={method} />
        <code className="font-mono text-sm text-foreground font-semibold flex-1">{path}</code>
        <span className="text-xs text-muted-foreground hidden md:block">{description}</span>
        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-border/60 p-4 flex flex-col gap-5 bg-card/10">
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

          {/* Auth requirement */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Authentication:</span>
            {auth === "api-key" && <Badge variant="outline" className="rounded text-[10px] border-violet-500/20 text-violet-400">x-api-key header</Badge>}
            {auth === "jwt" && <Badge variant="outline" className="rounded text-[10px] border-blue-500/20 text-blue-400">Bearer JWT token</Badge>}
            {auth === "none" && <Badge variant="outline" className="rounded text-[10px]">None (Public)</Badge>}
          </div>

          {/* Parameters */}
          {params && params.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Parameters</span>
              <div className="flex flex-col gap-1.5">
                {params.map((p) => (
                  <div key={p.name} className="grid grid-cols-12 gap-2 text-xs items-start p-2 rounded-lg bg-muted/20">
                    <code className="col-span-3 font-mono font-bold text-primary">{p.name}</code>
                    <span className="col-span-2 text-muted-foreground font-mono">{p.type}</span>
                    <span className={`col-span-1 font-bold ${p.required ? "text-rose-500" : "text-muted-foreground"}`}>
                      {p.required ? "req" : "opt"}
                    </span>
                    <span className="col-span-6 text-muted-foreground">{p.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request body */}
          {requestExample && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Request Body</span>
              <CodeBlock code={requestExample} language="json" />
            </div>
          )}

          {/* Response */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Response Example</span>
            <CodeBlock code={responseExample} language="json" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DocsPage() {
  const { keys } = useApiKeys();
  const activeKey = keys.find((k) => k.isActive);
  const displayKey = activeKey?.prefix ? `${activeKey.prefix}••••••••••••••••••••••` : "pfy_live_YOUR_KEY_HERE";

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "authentication", label: "Authentication" },
    { id: "generate", label: "Generate PDF" },
    { id: "status", label: "Check Status" },
    { id: "keys", label: "Manage Keys" },
    { id: "errors", label: "Error Codes" },
    { id: "limits", label: "Rate Limits" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 select-none">
      {/* ── Table of Contents Sidebar ── */}
      <aside className="lg:col-span-3 hidden lg:block">
        <div className="sticky top-6 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">On this page</span>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <ArrowRight className="h-3 w-3 opacity-40" />
              {s.label}
            </a>
          ))}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="lg:col-span-9 flex flex-col gap-10">

        {/* ── Overview ── */}
        <div id="overview" className="flex flex-col gap-4 scroll-mt-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">API Reference</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Pafyra API is a REST-based, JSON API for generating pixel-perfect PDF documents from HTML and CSS using a headless Chromium engine.
              All API requests must be made over HTTPS. Authentication is performed via your API key passed as a request header.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Globe className="h-4 w-4" />, label: "Base URL", value: "http://localhost:8080" },
              { icon: <Code2 className="h-4 w-4" />, label: "Format", value: "application/json" },
              { icon: <Zap className="h-4 w-4" />, label: "Engine", value: "Puppeteer / Chromium" },
            ].map((item) => (
              <Card key={item.label} className="border border-border/80 bg-card/40 rounded-xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="text-primary">{item.icon}</div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                    <code className="text-xs font-mono font-semibold text-foreground">{item.value}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Authentication ── */}
        <div className="flex flex-col gap-4">
          <SectionHeader
            id="authentication"
            icon={<Lock className="h-5 w-5" />}
            title="Authentication"
            description="All API calls to /api/v1/* must include your API key in the x-api-key request header. Keys are hashed with SHA-256 and never stored in plaintext."
          />

          {activeKey ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              You have an active API key: <code className="font-mono">{activeKey.prefix}••••••••</code>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs font-semibold text-amber-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              No active API key found.{" "}
              <Link href="/dashboard/api-keys" className="underline underline-offset-2">Generate one first →</Link>
            </div>
          )}

          <CodeBlock
            language="bash"
            code={`# Pass your key via the x-api-key header on every request
curl -X POST http://localhost:8080/api/v1/pdf/generate \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${displayKey}" \\
  -d '{"html": "<h1>Hello World</h1>", "format": "A4", "orientation": "PORTRAIT", "language": "en"}'`}
          />

          <CodeBlock
            language="javascript"
            code={`// Node.js / Fetch example
const response = await fetch("http://localhost:8080/api/v1/pdf/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${displayKey}",
  },
  body: JSON.stringify({
    html: "<h1>Hello World</h1>",
    format: "A4",
    orientation: "PORTRAIT",
    language: "en",
  }),
});

const { jobId, status, statusUrl } = await response.json();
// jobId: "550e8400-e29b-41d4-a716-446655440000"
// status: "queued"
// statusUrl: "/api/v1/pdf/status/550e8400-..."
`}
          />
        </div>

        {/* ── PDF Generation ── */}
        <div className="flex flex-col gap-4">
          <SectionHeader
            id="generate"
            icon={<FileText className="h-5 w-5" />}
            title="Generate PDF"
            description="Submit an HTML document to the Puppeteer rendering pipeline. The job is queued asynchronously and a job ID is returned immediately."
          />

          <EndpointCard
            method="POST"
            path="/api/v1/pdf/generate"
            auth="api-key"
            description="Enqueue a new PDF render job. The HTML is sanitized, injected with Arabic/Latin font stacks, then pushed to the Redis queue for the worker to pick up."
            params={[
              { name: "html", type: "string", required: true, description: "Full HTML document string. Max 1 MB (1,048,576 bytes)." },
              { name: "format", type: "string", required: false, description: "Paper size: A4, LETTER, A3, LEGAL. Default: A4" },
              { name: "orientation", type: "string", required: false, description: "PORTRAIT or LANDSCAPE. Default: PORTRAIT" },
              { name: "language", type: "string", required: false, description: "en (LTR) or ar (RTL Arabic shaping). Default: en" },
            ]}
            requestExample={`{
  "html": "<!DOCTYPE html><html><head><meta charset=\\"UTF-8\\"></head><body><h1>Invoice #2025-001</h1><p>Amount: $1,500.00</p></body></html>",
  "format": "A4",
  "orientation": "PORTRAIT",
  "language": "en"
}`}
            responseExample={`// HTTP 202 Accepted
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "statusUrl": "/api/v1/pdf/status/550e8400-e29b-41d4-a716-446655440000"
}`}
          />
        </div>

        {/* ── Job Status ── */}
        <div className="flex flex-col gap-4">
          <SectionHeader
            id="status"
            icon={<Terminal className="h-5 w-5" />}
            title="Check Job Status"
            description="Poll the status of a previously submitted PDF job. When status is 'done', a downloadUrl is provided pointing to your compiled PDF file."
          />

          <EndpointCard
            method="GET"
            path="/api/v1/pdf/status/{jobId}"
            auth="api-key"
            description="Retrieve the current processing state of a PDF generation job. Possible states: queued → processing → done | failed."
            params={[
              { name: "jobId", type: "UUID", required: true, description: "The job UUID returned from the generate endpoint." },
            ]}
            responseExample={`// While processing:
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing"
}

// When done:
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "done",
  "downloadUrl": "http://localhost:4000/files/550e8400-e29b-41d4-a716-446655440000.pdf",
  "completedAt": "2025-06-01T14:32:01.123Z"
}

// If failed:
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "failed",
  "error": "Timeout exceeded: browser failed to render under 10000ms"
}`}
          />

          <Card className="border border-border/80 bg-card/30 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" /> Polling Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="javascript"
                code={`// Poll until done (recommended interval: 1-2 seconds)
async function waitForPdf(jobId, apiKey) {
  while (true) {
    const res = await fetch(\`http://localhost:8080/api/v1/pdf/status/\${jobId}\`, {
      headers: { "x-api-key": apiKey }
    });
    const job = await res.json();

    if (job.status === "done") return job.downloadUrl;
    if (job.status === "failed") throw new Error(job.error);

    await new Promise(r => setTimeout(r, 1500)); // wait 1.5s
  }
}`}
              />
            </CardContent>
          </Card>
        </div>

        {/* ── API Key Management ── */}
        <div className="flex flex-col gap-4">
          <SectionHeader
            id="keys"
            icon={<KeyRound className="h-5 w-5" />}
            title="API Key Management"
            description="Manage API keys programmatically via JWT-authenticated endpoints. Keys require a valid login session token in the Authorization header."
          />

          <EndpointCard
            method="GET"
            path="/api/keys"
            auth="jwt"
            description="List all API keys for the authenticated user account. Returns usage count, monthly limit, and last-used timestamp per key."
            responseExample={`[
  {
    "keyId": "8f14e45f-ceea-467a-a866-2cf46f7d7b07",
    "prefix": "pfy_live_Hk7amm",
    "label": "Production Server Key",
    "usageCount": 47,
    "monthlyLimit": 100,
    "isActive": true,
    "createdAt": "2025-05-01T10:30:00Z",
    "lastUsed": "2025-05-18T04:10:00Z"
  }
]`}
          />

          <EndpointCard
            method="POST"
            path="/api/keys/create"
            auth="jwt"
            description="Generate a new SHA-256 hashed API key. The raw key is only returned once in this response — copy it immediately. Max 5 active keys per account."
            params={[
              { name: "label", type: "string", required: true, description: "A human-readable label to identify the key (e.g. 'Production Server Key')." },
            ]}
            requestExample={`{ "label": "Production Server Key" }`}
            responseExample={`{
  "keyId": "8f14e45f-ceea-467a-a866-2cf46f7d7b07",
  "key": "pfy_live_Hk7ammXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "prefix": "pfy_live_Hk7amm",
  "label": "Production Server Key"
}
// ⚠ The raw key is only returned ONCE. Store it securely.`}
          />

          <EndpointCard
            method="DELETE"
            path="/api/keys/{keyId}"
            auth="jwt"
            description="Permanently revoke an API key. All requests using this key will immediately receive a 401 Unauthorized response."
            params={[
              { name: "keyId", type: "UUID", required: true, description: "The UUID of the key to revoke." },
            ]}
            responseExample={`{ "message": "Key revoked" }`}
          />
        </div>

        {/* ── Error Codes ── */}
        <div className="flex flex-col gap-4">
          <SectionHeader
            id="errors"
            icon={<AlertCircle className="h-5 w-5" />}
            title="Error Codes"
            description="The API uses standard HTTP status codes. All error responses include a JSON body with an 'error' field describing what went wrong."
          />

          <Card className="border border-border/80 bg-card/30 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/20 border-b border-border/60">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-bold text-foreground/80 uppercase tracking-wider">Code</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-foreground/80 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-foreground/80 uppercase tracking-wider">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: "200", status: "OK", meaning: "Request successful. Response body contains the result." },
                    { code: "202", status: "Accepted", meaning: "PDF job queued successfully. Poll /status for completion." },
                    { code: "400", status: "Bad Request", meaning: "Invalid request body. Check HTML size or missing fields." },
                    { code: "401", status: "Unauthorized", meaning: "Missing or invalid x-api-key / JWT token." },
                    { code: "404", status: "Not Found", meaning: "Job ID does not exist or belongs to another key." },
                    { code: "429", status: "Too Many Requests", meaning: "Monthly rate limit exceeded. Upgrade your plan." },
                    { code: "500", status: "Server Error", meaning: "Internal error. The Puppeteer worker may be overloaded." },
                  ].map((row) => (
                    <tr key={row.code} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] font-bold rounded ${
                            row.code.startsWith("2") ? "border-emerald-500/20 text-emerald-400" :
                            row.code.startsWith("4") ? "border-rose-500/20 text-rose-400" :
                            "border-amber-500/20 text-amber-400"
                          }`}
                        >
                          {row.code}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-foreground">{row.status}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <CodeBlock
            language="json"
            code={`// All error responses follow this shape:
{
  "error": "HTML size exceeds maximum allowed size of 1048576 bytes"
}

// Rate limit exceeded (429):
{
  "error": "Monthly rate limit of 100 requests exceeded"
}`}
          />
        </div>

        {/* ── Rate Limits ── */}
        <div className="flex flex-col gap-4">
          <SectionHeader
            id="limits"
            icon={<Zap className="h-5 w-5" />}
            title="Rate Limits & Quotas"
            description="Rate limits are enforced per API key per calendar month using a Redis counter. Upgrade your plan for higher limits."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                plan: "Free",
                price: "$0/mo",
                limits: ["100 PDF renders / month", "5 active API keys", "Max 1MB HTML input", "10s render timeout"],
                highlight: false,
              },
              {
                plan: "Pro",
                price: "$19/mo",
                limits: ["1,000 PDF renders / month", "25 active API keys", "Max 1MB HTML input", "30s render timeout"],
                highlight: true,
              },
            ].map((plan) => (
              <Card
                key={plan.plan}
                className={`rounded-xl ${plan.highlight ? "border-primary bg-primary/5" : "border-border/80 bg-card/30"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">{plan.plan} Plan</CardTitle>
                    <span className="text-lg font-extrabold text-foreground">{plan.price}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {plan.limits.map((l) => (
                    <div key={l} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className={`h-3.5 w-3.5 shrink-0 ${plan.highlight ? "text-primary" : "text-emerald-500"}`} />
                      {l}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/20 border border-border/60 text-xs text-muted-foreground leading-relaxed">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Rate limit counters reset at <strong className="text-foreground">00:00 UTC on the 1st of each month</strong>.
              The current usage count is tracked in the <code className="font-mono bg-muted px-1 rounded">x-ratelimit-remaining</code> response header.
              If exceeded, requests will receive a <code className="font-mono bg-muted px-1 rounded">429 Too Many Requests</code> response.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
