"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  FileCode,
  Globe2,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { pdfApi } from "@/lib/api";
import { toast } from "sonner";
import { useApiKeys } from "@/hooks/useApiKeys";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import Link from "next/link";

const ENGLISH_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #4F46E5;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    .invoice-title {
      font-size: 28px;
      font-weight: bold;
      color: #4F46E5;
    }
    .company-details {
      text-align: right;
    }
    .billing-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    th {
      background-color: #F4F4F5;
      color: #4F46E5;
      font-weight: bold;
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #E4E4E7;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #E4E4E7;
    }
    .totals {
      text-align: right;
      font-size: 16px;
    }
    .grand-total {
      font-size: 20px;
      font-weight: bold;
      color: #4F46E5;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div>Invoice ID: #INV-2026-001</div>
      <div>Date: May 18, 2026</div>
    </div>
    <div class="company-details">
      <h3>Pafyra Systems</h3>
      <div>developer@pafyra.com</div>
      <div>http://pafyra.com</div>
    </div>
  </div>

  <div class="billing-section">
    <div>
      <strong>Billed To:</strong>
      <div>Acme Corporation</div>
      <div>billing@acme.com</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Pro SaaS PDF Subscription (Annual)</td>
        <td>1</td>
        <td>$180.00</td>
        <td>$180.00</td>
      </tr>
      <tr>
        <td>Dedicated rendering worker node</td>
        <td>1</td>
        <td>$45.00</td>
        <td>$45.00</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div>Subtotal: $225.00</div>
    <div class="grand-total">Total Amount: $225.00</div>
  </div>
</body>
</html>`;

const ARABIC_TEMPLATE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Cairo', 'Tajawal', sans-serif;
      margin: 40px;
      color: #333;
      direction: rtl;
      text-align: right;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #4F46E5;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    .invoice-title {
      font-size: 28px;
      font-weight: bold;
      color: #4F46E5;
    }
    .company-details {
      text-align: left;
    }
    .billing-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    th {
      background-color: #F4F4F5;
      color: #4F46E5;
      font-weight: bold;
      padding: 12px;
      text-align: right;
      border-bottom: 1px solid #E4E4E7;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #E4E4E7;
      text-align: right;
    }
    .totals {
      text-align: left;
      font-size: 16px;
    }
    .grand-total {
      font-size: 20px;
      font-weight: bold;
      color: #4F46E5;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">فاتورة مبيعات</div>
      <div>رقم الفاتورة: #INV-2026-001</div>
      <div>التاريخ: ١٨ مايو ٢٠٢٦</div>
    </div>
    <div class="company-details">
      <h3>شركة بافيرا للمعلوماتية</h3>
      <div>developer@pafyra.com</div>
    </div>
  </div>

  <div class="billing-section">
    <div>
      <strong>مستند إلى:</strong>
      <div>شركة القمة للتجارة</div>
      <div>billing@acme.com</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>الوصف</th>
        <th>الكمية</th>
        <th>سعر الوحدة</th>
        <th>المجموع</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>الاشتراك السنوي - بافيرا برو</td>
        <td>١</td>
        <td>١٨٠٫٠٠ دولار</td>
        <td>١٨٠٫٠٠ دولار</td>
      </tr>
      <tr>
        <td>خادم معالجة مخصص لمستندات PDF</td>
        <td>١</td>
        <td>٤٥٫٠٠ دولار</td>
        <td>٤٥٫٠٠ دولار</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div>المجموع الفرعي: ٢٢٥٫٠٠ دولار</div>
    <div class="grand-total">المبلغ الإجمالي: ٢٢٥٫٠٠ دولار</div>
  </div>
</body>
</html>`;

export default function PdfCompilerPage() {
  const [html, setHtml] = useState(ENGLISH_TEMPLATE);
  const [format, setFormat] = useState<"A4" | "LETTER" | "LEGAL">("A4");
  const [orientation, setOrientation] = useState<"PORTRAIT" | "LANDSCAPE">("PORTRAIT");
  const [isArabic, setIsArabic] = useState(false);

  // API Key Check
  const { keys, isLoading: isLoadingKeys } = useApiKeys();
  const hasActiveKey = keys.some(k => k.isActive);

  // Job states
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilingStep, setCompilingStep] = useState<"submitting" | "queued" | "processing" | "done" | "failed">("submitting");
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle dynamic templates when Arabic switch turns on/off
  useEffect(() => {
    if (isArabic) {
      setHtml(ARABIC_TEMPLATE);
    } else {
      setHtml(ENGLISH_TEMPLATE);
    }
  }, [isArabic]);

  const handleSubmit = async () => {
    // Reset status
    setIsCompiling(true);
    setCompilingStep("submitting");
    setErrorMessage("");
    setDownloadUrl("");

    try {
      const payload = {
        html,
        format,
        orientation,
        language: isArabic ? "ar" : "en",
      };

      const res = await pdfApi.generate(payload);
      const jobId = res.jobId;
      toast.info("PDF job submitted! Starting status polling...");

      // Start Polling
      pollStatus(jobId);
    } catch (err: any) {
      setIsCompiling(false);
      setCompilingStep("failed");
      setErrorMessage(err.response?.data?.message || "Failed to submit render job to queue");
      toast.error("Generation failed");
    }
  };

  const pollStatus = (jobId: string) => {
    let attempts = 0;
    pollingRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 30) {
        // 30 seconds max timeout
        clearPolling();
        setCompilingStep("failed");
        setErrorMessage("Compile process timed out. Puppeteer did not respond under 30 seconds.");
        setIsCompiling(false);
        toast.error("Timeout exceeded");
        return;
      }

      try {
        const job = await pdfApi.status(jobId);
        if (job.status === "queued") {
          setCompilingStep("queued");
        } else if (job.status === "processing") {
          setCompilingStep("processing");
        } else if (job.status === "done") {
          clearPolling();
          setCompilingStep("done");
          setDownloadUrl(job.downloadUrl || "");
          setIsCompiling(false);
          toast.success("PDF rendered successfully!");
        } else if (job.status === "failed") {
          clearPolling();
          setCompilingStep("failed");
          setErrorMessage(job.error || "Puppeteer failed to compile. Verify HTML syntax and resource locks.");
          setIsCompiling(false);
          toast.error("Compile failure recorded");
        }
      } catch (err) {
        // Ignored, try again in next tick
      }
    }, 1500);
  };

  const clearPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearPolling();
  }, []);

  if (isLoadingKeys) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner text="Verifying API credentials..." />
      </div>
    );
  }

  if (!hasActiveKey) {
    return (
      <div className="flex flex-col gap-8 select-none">
        <EmptyState
          icon={<KeyRound className="h-6 w-6" />}
          title="API Key Required"
          description="You need to generate an active API credential before you can use the compiler sandbox to run renders. This ensures your account is properly billed for CPU time."
          action={
            <Link href="/dashboard/api-keys">
              <Button size="sm" className="rounded-lg cursor-pointer">Generate API Key Now</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-140px)]">
      {/* ────────────────── LEFT COLUMN: CODE EDITOR & INPUTS ────────────────── */}
      <div className="lg:col-span-6 flex flex-col gap-6 select-none">
        <Card className="border border-border/80 bg-card/40 backdrop-blur-sm rounded-2xl flex flex-col flex-grow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-bold">HTML Markup Editor</CardTitle>
              </div>
              
              {/* Dynamic RTL Arabic Toggle */}
              <div className="flex items-center gap-2 px-3 py-1 bg-muted/60 border border-border rounded-xl">
                <Globe2 className="h-4 w-4 text-primary" />
                <Label htmlFor="arabic-rtl" className="text-xs font-bold text-foreground cursor-pointer">Arabic (RTL)</Label>
                <Switch
                  id="arabic-rtl"
                  checked={isArabic}
                  onCheckedChange={setIsArabic}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-col gap-5 flex-grow">
            {/* Editor Input Area */}
            <div className="flex-grow flex flex-col gap-1.5 min-h-[300px]">
              <Textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="w-full h-full min-h-[280px] font-mono text-xs text-foreground bg-zinc-950 p-4 border-border/85 rounded-xl resize-none outline-none focus-visible:ring-1 focus-visible:ring-primary leading-normal overflow-y-auto selection:bg-primary/20"
                placeholder="<!-- Paste your HTML here -->"
                disabled={isCompiling}
              />
            </div>

            {/* Layout Parameters Panel */}
            <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="layout-format" className="text-xs font-semibold text-muted-foreground">Document Format</Label>
                <Select
                  value={format}
                  onValueChange={(val: any) => setFormat(val)}
                  disabled={isCompiling}
                >
                  <SelectTrigger id="layout-format" className="rounded-lg bg-muted/40 border-border/80 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/80">
                    <SelectItem value="A4">A4 Standard</SelectItem>
                    <SelectItem value="LETTER">US Letter</SelectItem>
                    <SelectItem value="LEGAL">US Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="layout-orientation" className="text-xs font-semibold text-muted-foreground">Page Orientation</Label>
                <Select
                  value={orientation}
                  onValueChange={(val: any) => setOrientation(val)}
                  disabled={isCompiling}
                >
                  <SelectTrigger id="layout-orientation" className="rounded-lg bg-muted/40 border-border/80 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/80">
                    <SelectItem value="PORTRAIT">Portrait</SelectItem>
                    <SelectItem value="LANDSCAPE">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full py-5 rounded-xl font-bold mt-2 shadow-lg shadow-indigo-500/10 cursor-pointer"
              onClick={handleSubmit}
              disabled={isCompiling}
            >
              {isCompiling ? (
                <>
                  <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" /> Compiling Document...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4 fill-white" /> Compile & Render PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ────────────────── RIGHT COLUMN: INTERACTIVE PREVIEW PANE ────────────────── */}
      <div className="lg:col-span-6 h-full overflow-hidden select-none">
        <Card className="border border-border/80 bg-zinc-950/20 backdrop-blur-sm rounded-2xl h-full flex flex-col">
          <CardHeader className="border-b border-border/40 pb-4 bg-card/25">
            <CardTitle className="text-base font-bold text-foreground">Interactive Output Sandbox</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Live PDF rendering view inside standard browser iframes</CardDescription>
          </CardHeader>

          <CardContent className="p-0 flex-grow flex flex-col items-center justify-center relative bg-zinc-950/40">
            {/* Compile States Panels */}
            {!isCompiling && !downloadUrl && (
              <div className="flex flex-col items-center gap-4 text-center p-8">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Awaiting Generation</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Compose your template on the left editor and hit **Compile** to render the document preview instantly.
                </p>
              </div>
            )}

            {/* Loading/Polling Steps */}
            {isCompiling && (
              <div className="flex flex-col items-center gap-4 text-center p-8 animate-in fade-in duration-300">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground capitalize">
                    {compilingStep === "submitting" && "Submitting payload..."}
                    {compilingStep === "queued" && "Waiting in Queue..."}
                    {compilingStep === "processing" && "Executing Puppeteer..."}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    {compilingStep === "submitting" && "Pushing HTML string data packages to API base..."}
                    {compilingStep === "queued" && "Job enqueued in Redis database pool. Shifting nodes..."}
                    {compilingStep === "processing" && "Worker grabbed task. Formatting directionality and compiling PDF payload..."}
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {!isCompiling && compilingStep === "failed" && (
              <div className="flex flex-col items-center gap-4 text-center p-8 animate-in fade-in duration-300">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <div className="flex flex-col gap-1 max-w-sm">
                  <h3 className="text-sm font-bold text-foreground">Compilation Failed</h3>
                  <p className="text-xs text-rose-500 bg-destructive/5 border border-destructive/10 p-3 rounded-lg font-mono leading-relaxed mt-2 text-left">
                    {errorMessage}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg mt-2 cursor-pointer" onClick={handleSubmit}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Re-trigger render
                </Button>
              </div>
            )}

            {/* Iframe View on Done */}
            {!isCompiling && downloadUrl && (
              <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
                {/* Embedded Iframe Preview */}
                <div className="flex-grow w-full border-0 relative bg-zinc-900">
                  <iframe
                    src={downloadUrl}
                    className="w-full h-full border-0"
                    title="Compiled PDF Preview"
                  />
                </div>

                {/* Successful control footer */}
                <div className="p-4 bg-card/45 border-t border-border/45 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle className="h-4.5 w-4.5" />
                    <span className="text-xs font-bold">PDF compiled successfully</span>
                  </div>
                  <a href={downloadUrl} download="pafyra_document.pdf" target="_blank" className="cursor-pointer">
                    <Button size="sm" className="rounded-lg shadow-emerald-500/10 cursor-pointer">
                      <Download className="h-3.5 w-3.5 mr-1.5" /> Download File
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
