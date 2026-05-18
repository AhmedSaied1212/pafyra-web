export interface User {
  userId: string;
  email: string;
  fullName: string;
  company?: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  createdAt: string;
}

export interface ApiKey {
  keyId: string;
  prefix: string;
  label: string;
  key?: string; // only present on creation
  isActive: boolean;
  usageCount: number;
  monthlyLimit: number;
  createdAt: string;
  lastUsed?: string;
}

export interface Job {
  jobId: string;
  status: "queued" | "processing" | "done" | "failed";
  format: "A4" | "LETTER" | "LEGAL";
  orientation: "PORTRAIT" | "LANDSCAPE";
  language: "en" | "ar";
  size?: number;
  durationMs?: number;
  error?: string;
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
  inputHtml?: string;
}

export interface UsageSummary {
  totalPdfs: number;
  successRate: number;
  totalSize: number; // in bytes
  avgGenTimeMs: number;
  pdfUsageProgress: number; // monthly pdf usage count
  pdfLimit: number;
  activeKeys: number;
  keysLimit: number;
  jobsToday: number;
  jobsTodayTrend: string;
}

export interface UsageChartData {
  date: string;
  done: number;
  failed: number;
}

export interface GenerationTimeChartData {
  date: string;
  timeMs: number;
}
