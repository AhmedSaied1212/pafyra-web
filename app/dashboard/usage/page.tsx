"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  HardDrive,
  FileSpreadsheet,
  Activity,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsage } from "@/hooks/useUsage";
import { formatBytes } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AnalyticsPage() {
  const { summary, chartData, speedData, isLoading } = useUsage();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner text="Analyzing Puppeteer engine log matrices..." />
      </div>
    );
  }

  const breakdownData = [
    { endpoint: "/api/v1/pdf/generate", type: "POST", calls: summary?.totalPdfs || 0, share: "100%", status: "Healthy" },
    { endpoint: "/api/v1/pdf/status/{id}", type: "GET", calls: (summary?.totalPdfs || 0) * 3.5, share: "--", status: "Healthy" },
    { endpoint: "/internal/jobs/{id}/complete", type: "POST", calls: summary?.totalPdfs || 0, share: "--", status: "Healthy" },
  ];

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header and description */}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">
          Trace compile durations, network speeds, transaction loads, and endpoint metrics.
        </p>
      </div>

      {/* Grid count cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border border-border/80 bg-card/45 backdrop-blur-sm rounded-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total transactions</span>
              <span className="text-xl font-extrabold text-foreground tracking-tight">{summary?.totalPdfs} requests</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card/45 backdrop-blur-sm rounded-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Compile Success</span>
              <span className="text-xl font-extrabold text-foreground tracking-tight">{summary?.successRate.toFixed(1)}% ratio</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card/45 backdrop-blur-sm rounded-xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 bg-violet-500/10 text-violet-500 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg Compile Speed</span>
              <span className="text-xl font-extrabold text-foreground tracking-tight">
                {summary?.avgGenTimeMs ? `${(summary.avgGenTimeMs / 1000).toFixed(2)}s` : "0.0s"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Graphs Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Render volume */}
        <Card className="border border-border/80 bg-card/25 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground">API requests breakdown</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Successful versus failed compiles (last 15 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full text-xs font-mono text-muted-foreground">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <Bar dataKey="done" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Successful" />
                  <Bar dataKey="failed" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Compile Speeds Line Chart */}
        <Card className="border border-border/80 bg-card/25 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground">Worker processing speed</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Average generation pipeline duration in milliseconds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full text-xs font-mono text-muted-foreground">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={speedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  <Line
                    type="monotone"
                    dataKey="timeMs"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Compile Time (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdowns Table */}
      <Card className="border border-border/80 bg-card/25 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/20 border-b border-border/60">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" /> Endpoint Usage Breakdown
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Total API calls mapped across core routing paths</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/60 hover:bg-transparent">
              <TableHead className="font-semibold text-xs py-4 px-6 text-foreground/80 uppercase">HTTP Route Path</TableHead>
              <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Method</TableHead>
              <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Total Hits</TableHead>
              <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Allocation Share</TableHead>
              <TableHead className="font-semibold text-xs py-4 px-6 text-right uppercase">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breakdownData.map((item, idx) => (
              <TableRow key={idx} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs font-semibold py-4 px-6 text-foreground">
                  {item.endpoint}
                </TableCell>
                <TableCell className="py-4 px-4 text-xs font-bold text-muted-foreground font-mono">
                  <Badge variant="outline" className="rounded font-mono px-1.5 py-0.5 border-border/80">
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-4 text-sm font-semibold text-foreground">
                  {item.calls.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-muted-foreground font-semibold">
                  {item.share}
                </TableCell>
                <TableCell className="py-4 px-6 text-right text-xs font-bold text-emerald-500">
                  {item.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
