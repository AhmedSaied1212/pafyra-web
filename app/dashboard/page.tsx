"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle,
  HardDrive,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Copy,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import { useJobs } from "@/hooks/useJobs";
import { formatBytes, formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DashboardOverviewPage() {
  const { user } = useUser();
  const { summary, chartData, isLoading } = useUsage();
  const { jobs, isLoading: isJobsLoading } = useJobs();
  const [currentGreeting, setCurrentGreeting] = useState("Hello");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setCurrentGreeting("Good morning");
    else if (hours < 18) setCurrentGreeting("Good afternoon");
    else setCurrentGreeting("Good evening");
  }, []);

  if (isLoading || isJobsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner text="Compiling dashboard metrics..." />
      </div>
    );
  }

  // Abbreviate recent jobs (max 3)
  const recentJobs = jobs.slice(0, 3);

  const stats = [
    {
      title: "Total PDF Jobs",
      value: summary?.totalPdfs || 0,
      description: "Generations enqueued",
      icon: <FileText className="h-5 w-5 text-primary" />,
      bg: "bg-primary/10",
      progress: (summary?.pdfUsageProgress || 0) / (summary?.pdfLimit || 100) * 100,
      progressText: `${summary?.pdfUsageProgress || 0}/${summary?.pdfLimit || 100} quota used`,
    },
    {
      title: "Success Rate",
      value: `${summary?.successRate.toFixed(1) || "100"}%`,
      description: "API render compliance",
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      bg: "bg-emerald-500/10",
    },
    {
      title: "Storage Utilized",
      value: formatBytes(summary?.totalSize || 0),
      description: "PDF output payload",
      icon: <HardDrive className="h-5 w-5 text-amber-500" />,
      bg: "bg-amber-500/10",
    },
    {
      title: "Avg Generation Time",
      value: summary?.avgGenTimeMs ? `${(summary.avgGenTimeMs / 1000).toFixed(2)}s` : "0.0s",
      description: "Puppeteer pipeline speed",
      icon: <Clock className="h-5 w-5 text-violet-500" />,
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground tracking-tight">
            {currentGreeting}, {user?.fullName || "Developer"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your PDF compiler nodes today.
          </p>
        </div>

        <Link href="/dashboard/generate">
          <Button className="rounded-xl shadow-lg shadow-indigo-500/20 font-semibold cursor-pointer">
            <Plus className="h-4.5 w-4.5 mr-2" /> Launch Sandbox
          </Button>
        </Link>
      </div>

      {/* Upgrade Callout */}
      {user?.plan === "FREE" && (
        <Card className="border border-primary bg-gradient-to-r from-primary/5 via-indigo-900/[0.05] to-transparent rounded-2xl relative overflow-hidden select-none">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 fill-primary" /> Premium Subscription upgrade
              </span>
              <h3 className="text-lg md:text-xl font-bold text-foreground">
                Get unlimited compiles and priority worker queues today
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                You are currently enqueuing on the Free Plan. Upgrade to the Pro Plan to skip worker queue times, set custom size parameters, and get unlimited Monthly compiles.
              </p>
            </div>
            <Link href="/dashboard/billing">
              <Button className="rounded-xl shadow-lg shadow-indigo-500/15 cursor-pointer flex items-center">
                Upgrade to Pro <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Grid count cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border border-border/80 bg-card/40 backdrop-blur-sm rounded-xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</span>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-extrabold text-foreground tracking-tight">{stat.value}</span>
                <span className="text-[11px] text-muted-foreground">{stat.description}</span>
              </div>
              {stat.progressText && (
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, stat.progress)}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.progressText}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
        {/* area graph */}
        <Card className="lg:col-span-8 border border-border/80 bg-card/20 backdrop-blur-md rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">API Generations Volume</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Monthly compilation totals by status (last 15 days)</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp className="h-3.5 w-3.5" /> Healthy compiles
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[280px] w-full text-xs font-mono text-muted-foreground">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="done"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorDone)"
                      name="Successful"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center italic text-muted-foreground/60">
                  No generation coordinates recorded
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs Preview */}
        <Card className="lg:col-span-4 border border-border/80 bg-card/20 backdrop-blur-md rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-foreground">Recent Jobs</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Latest transaction queues in process</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div
                  key={job.jobId || (job as any).id || Math.random().toString()}
                  className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/80"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-mono text-xs text-foreground font-semibold truncate max-w-[140px]">
                      {job.jobId}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      {formatDate(job.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Badge
                      variant={
                        job.status === "done" ? "default" : job.status === "failed" ? "destructive" : "outline"
                      }
                      className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        job.status === "done" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 border-emerald-500/20" : ""
                      }`}
                    >
                      {job.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {job.size ? formatBytes(job.size) : "Pending"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                <span className="text-xs text-muted-foreground/60 italic font-semibold">No recent rendering jobs enqueued</span>
              </div>
            )}

            <Link href="/dashboard/jobs" className="mt-2">
              <Button variant="outline" className="w-full rounded-xl text-xs font-semibold cursor-pointer">
                View all transaction logs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
