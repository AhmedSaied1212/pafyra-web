"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  SlidersHorizontal,
  Download,
  AlertCircle,
  Copy,
  Eye,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useJobs } from "@/hooks/useJobs";
import { formatBytes, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import { Job } from "@/types";

export default function JobsHistoryPage() {
  const { jobs, isLoading } = useJobs();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [langFilter, setLangFilter] = useState<string>("all");

  // Job Inspector modal state
  const [activeInspectorJob, setActiveInspectorJob] = useState<Job | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner text="Querying database ledger logs..." />
      </div>
    );
  }

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.jobId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesLang = langFilter === "all" || job.language === langFilter;
    return matchesSearch && matchesStatus && matchesLang;
  });

  const handleCopyJobId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.success("Job transaction ID copied!");
  };

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header and description */}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">
          Audit complete transaction records, compile duration, and output metadata.
        </p>
      </div>

      {/* Filter and control panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
          <Input
            placeholder="Search by job transaction ID..."
            className="pl-10 rounded-xl bg-card border-border/80 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* status filter */}
        <div className="md:col-span-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="rounded-xl bg-card border-border/80 text-sm">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Status: All" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card border-border/80">
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="done">Successful</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* language filter */}
        <div className="md:col-span-3">
          <Select value={langFilter} onValueChange={setLangFilter}>
            <SelectTrigger className="rounded-xl bg-card border-border/80 text-sm">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Language: All" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card border-border/80">
              <SelectItem value="all">Language: All</SelectItem>
              <SelectItem value="en">English (LTR)</SelectItem>
              <SelectItem value="ar">Arabic (RTL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ledger Jobs Table */}
      {filteredJobs.length > 0 ? (
        <Card className="border border-border/80 bg-card/25 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-b border-border/60 hover:bg-transparent">
                  <TableHead className="font-semibold text-xs py-4 px-6 text-foreground/80 uppercase">Job Transaction ID</TableHead>
                  <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Format</TableHead>
                  <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Language</TableHead>
                  <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Size</TableHead>
                  <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Compiled Date</TableHead>
                  <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Status</TableHead>
                  <TableHead className="font-semibold text-xs py-4 px-6 text-right uppercase">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.jobId} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs font-semibold py-4 px-6 truncate max-w-[180px] text-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{job.jobId}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground rounded"
                          onClick={() => handleCopyJobId(job.jobId)}
                          aria-label="Copy ID"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 font-semibold text-sm">
                      {job.format} <span className="text-[10px] text-muted-foreground font-normal uppercase ml-1">({job.orientation.toLowerCase()})</span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-sm font-semibold">
                      <Badge variant="outline" className="rounded-md border-border/60 text-[10px] uppercase font-bold py-0.5">
                        {job.language === "ar" ? "Arabic" : "English"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-sm font-mono text-muted-foreground">
                      {job.size ? formatBytes(job.size) : "N/A"}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-xs font-semibold text-muted-foreground">
                      {formatDate(job.createdAt)}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Badge
                        variant={
                          job.status === "done" ? "default" : job.status === "failed" ? "destructive" : "outline"
                        }
                        className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                          job.status === "done" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 border-emerald-500/20" : ""
                        }`}
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted/80 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={() => setActiveInspectorJob(job)}
                          aria-label="Inspect metadata"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {job.status === "done" && job.downloadUrl && (
                          <a href={job.downloadUrl} download target="_blank" className="cursor-pointer">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-muted/80 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                              aria-label="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No Transaction Logs Found"
          description="We couldn't locate any PDF render logs matching your search parameters. Launch the compiler sandbox to queue one!"
          action={
            <Link href="/dashboard/generate">
              <Button size="sm" className="rounded-lg">Launch Sandbox</Button>
            </Link>
          }
        />
      )}

      {/* ────────────────── METADATA INSPECTOR MODAL ────────────────── */}
      <Dialog open={!!activeInspectorJob} onOpenChange={(open) => !open && setActiveInspectorJob(null)}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="text-base font-bold text-foreground">Transaction Metadata Audit</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Comprehensive system details for job run</DialogDescription>
          </DialogHeader>

          {activeInspectorJob && (
            <div className="flex flex-col gap-4 mt-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Job Transaction ID</span>
                <span className="font-mono text-xs font-bold text-foreground bg-muted/40 p-2 border rounded-lg flex items-center justify-between">
                  {activeInspectorJob.jobId}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 hover:bg-muted/80 rounded"
                    onClick={() => handleCopyJobId(activeInspectorJob.jobId)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Document Format</span>
                  <span className="text-sm font-semibold text-foreground capitalize">
                    {activeInspectorJob.format} ({activeInspectorJob.orientation.toLowerCase()})
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Language Parameter</span>
                  <span className="text-sm font-semibold text-foreground">
                    {activeInspectorJob.language === "ar" ? "Arabic (RTL shaping)" : "English (LTR)"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Compiled Output Size</span>
                  <span className="text-sm font-semibold font-mono text-foreground">
                    {activeInspectorJob.size ? formatBytes(activeInspectorJob.size) : "Pending/Failed"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Worker Pipeline Duration</span>
                  <span className="text-sm font-semibold font-mono text-foreground">
                    {activeInspectorJob.durationMs ? `${(activeInspectorJob.durationMs / 1000).toFixed(2)}s` : "Pending/Failed"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-border/40 pt-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Queued Timestamp</span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(activeInspectorJob.createdAt, "full")}
                </span>
              </div>

              {activeInspectorJob.status === "failed" && activeInspectorJob.error && (
                <div className="flex flex-col gap-1 border-t border-border/40 pt-3">
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Compiler Error Logs
                  </span>
                  <p className="text-[11px] text-rose-500 bg-destructive/5 border border-destructive/10 p-2.5 rounded-lg font-mono leading-relaxed text-left">
                    {activeInspectorJob.error}
                  </p>
                </div>
              )}

              {activeInspectorJob.status === "done" && activeInspectorJob.downloadUrl && (
                <div className="flex gap-3 mt-2 border-t border-border/40 pt-4 select-none">
                  <a href={activeInspectorJob.downloadUrl} download className="flex-grow cursor-pointer">
                    <Button className="w-full rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                      <Download className="h-4 w-4" /> Download PDF File
                    </Button>
                  </a>
                  <a href={activeInspectorJob.downloadUrl} target="_blank" className="flex-grow cursor-pointer">
                    <Button variant="outline" className="w-full rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                      Open in Tab
                    </Button>
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Quick helper
function Globe2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
