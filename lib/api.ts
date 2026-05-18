import axios from "axios";
import { User, ApiKey, Job, UsageSummary, UsageChartData, GenerationTimeChartData } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Helper for tokens
export const tokenHelper = {
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pafyra_jwt", token);
      document.cookie = `pafyra_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
  },
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pafyra_jwt");
    }
    return null;
  },
  clearToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pafyra_jwt");
      localStorage.removeItem("pafyra_user");
      document.cookie = "pafyra_token=; path=/; max-age=0";
    }
  },
  setUser: (user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pafyra_user", JSON.stringify(user));
    }
  },
  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("pafyra_user");
      return u ? JSON.parse(u) : null;
    }
    return null;
  },
};

// Request Interceptor: Attach JWT
api.interceptors.request.use((config) => {
  const token = tokenHelper.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: 401 intercept
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      tokenHelper.clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// ----------------------------------------------------
// LOCAL STORAGE MOCK DATABASE (For offline robustness)
// ----------------------------------------------------
const initMockDB = () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("mock_user")) {
    const mockUser: User = {
      userId: "usr-mock-12345",
      email: "developer@pafyra.com",
      fullName: "John Doe",
      company: "Acme Corp",
      plan: "FREE",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
  }

  if (!localStorage.getItem("mock_keys")) {
    const mockKeys: ApiKey[] = [
      {
        keyId: "key-1",
        prefix: "pfy_live_Hk7amm-",
        label: "Production Server Key",
        key: "pfy_live_Hk7amm-f938b81c20f12c98d76a5e4",
        isActive: true,
        usageCount: 47,
        monthlyLimit: 100,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        keyId: "key-2",
        prefix: "pfy_live_t9K2mQ-",
        label: "Staging Testing Key",
        key: "pfy_live_t9K2mQ-1092c738e81cfd8a9e761c0",
        isActive: true,
        usageCount: 5,
        monthlyLimit: 100,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem("mock_keys", JSON.stringify(mockKeys));
  }

  if (!localStorage.getItem("mock_jobs")) {
    const mockJobs: Job[] = [
      {
        jobId: "bc1bc63e-9ffa-4adf-8efd-c977101fff71",
        status: "done",
        format: "A4",
        orientation: "PORTRAIT",
        language: "en",
        size: 51230,
        durationMs: 1200,
        downloadUrl: "https://pdfobject.com/pdf/sample.pdf",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 30 * 60 * 1000 + 1200).toISOString(),
        inputHtml: "<html><body><h1>Sales Invoice</h1></body></html>",
      },
      {
        jobId: "6f1ae53e-8ca4-4795-b2b9-fb921d4513f7",
        status: "done",
        format: "A4",
        orientation: "PORTRAIT",
        language: "ar",
        size: 88798,
        durationMs: 1400,
        downloadUrl: "https://pdfobject.com/pdf/sample.pdf",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 1400).toISOString(),
        inputHtml: "<html dir='rtl'><body><h1>فاتورة مبيعات</h1></body></html>",
      },
      {
        jobId: "err-999aa-4adf-8efd-192837fffa1",
        status: "failed",
        format: "LETTER",
        orientation: "LANDSCAPE",
        language: "en",
        error: "Timeout exceeded: browser failed to render under 10000ms",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        inputHtml: "<html><body><h1>Complex Layout</h1></body></html>",
      },
    ];
    localStorage.setItem("mock_jobs", JSON.stringify(mockJobs));
  }
};

if (typeof window !== "undefined") {
  initMockDB();
}

// Check if running in Mock Mode (offline fallback)
const isMockMode = async (): Promise<boolean> => {
  return false;
};

// ----------------------------------------------------
// API METHODS
// ----------------------------------------------------

export const authApi = {
  register: async (data: any): Promise<{ userId: string; message: string }> => {
    if (await isMockMode()) {
      const mockUser = JSON.parse(localStorage.getItem("mock_user") || "{}");
      mockUser.fullName = data.fullName;
      mockUser.email = data.email;
      localStorage.setItem("mock_user", JSON.stringify(mockUser));
      tokenHelper.setUser(mockUser);
      tokenHelper.setToken("mock-jwt-token-12345");
      return { userId: mockUser.userId, message: "Account created (Mock)" };
    }
    const res = await api.post("/api/auth/register", data);
    return res.data;
  },

  login: async (data: any): Promise<{ token: string; userId: string | null }> => {
    if (await isMockMode()) {
      const mockUser = JSON.parse(localStorage.getItem("mock_user") || "{}");
      if (data.email.toLowerCase() === mockUser.email.toLowerCase()) {
        tokenHelper.setUser(mockUser);
        tokenHelper.setToken("mock-jwt-token-12345");
        return { token: "mock-jwt-token-12345", userId: mockUser.userId };
      }
      // If logging in with a new user in mock mode
      const newUser: User = {
        userId: "usr-" + Math.random().toString(36).substr(2, 9),
        email: data.email,
        fullName: data.email.split("@")[0].toUpperCase(),
        plan: "FREE",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("mock_user", JSON.stringify(newUser));
      tokenHelper.setUser(newUser);
      tokenHelper.setToken("mock-jwt-token-12345");
      return { token: "mock-jwt-token-12345", userId: newUser.userId };
    }
    const res = await api.post("/api/auth/login", data);
    const token = res.data.token;
    tokenHelper.setToken(token);
    // Fetch profile and store
    const user = {
      userId: res.data.userId || "usr-prod-id",
      email: data.email,
      fullName: data.email.split("@")[0].toUpperCase(),
      plan: "FREE" as const,
      createdAt: new Date().toISOString(),
    };
    tokenHelper.setUser(user);
    return res.data;
  },
};

export const keysApi = {
  list: async (): Promise<ApiKey[]> => {
    const res = await api.get("/api/keys");
    // ApiKeyResponse DTO: { keyId, prefix, label, usageCount, monthlyLimit, isActive }
    return res.data.map((k: any) => ({
      keyId: k.keyId || k.id,
      prefix: k.prefix || k.keyPrefix,
      label: k.label,
      key: undefined, // never revealed after creation
      isActive: k.isActive ?? true,
      usageCount: k.usageCount ?? 0,
      monthlyLimit: k.monthlyLimit ?? 100,
      createdAt: k.createdAt || new Date().toISOString(),
      lastUsed: k.lastUsed || undefined,
    }));
  },

  create: async (label: string): Promise<ApiKey> => {
    const res = await api.post("/api/keys/create", { label });
    // CreateKeyResponse DTO: { keyId, key (raw, one-time), prefix, label }
    const k = res.data;
    return {
      keyId: k.keyId,
      prefix: k.prefix,
      label: k.label,
      key: k.key, // one-time reveal of raw key
      isActive: true,
      usageCount: 0,
      monthlyLimit: 100,
      createdAt: new Date().toISOString(),
    };
  },

  revoke: async (id: string): Promise<void> => {
    await api.delete(`/api/keys/${id}`);
  },

  rotate: async (): Promise<ApiKey> => {
    const res = await api.post("/api/keys/rotate");
    const k = res.data;
    return {
      keyId: k.keyId,
      prefix: k.prefix,
      label: k.label,
      key: k.key, // one-time raw key reveal
      isActive: true,
      usageCount: 0,
      monthlyLimit: 50,
      createdAt: new Date().toISOString(),
    };
  },
};

export const pdfApi = {
  generate: async (data: any): Promise<{ jobId: string }> => {
    const res = await api.post("/api/v1/pdf/generate", data);
    return res.data;
  },

  status: async (jobId: string): Promise<Job> => {
    const res = await api.get(`/api/v1/pdf/status/${jobId}`);
    return { ...res.data, jobId: res.data.jobId || res.data.id };
  },

  listAll: async (): Promise<Job[]> => {
    // Use user-scoped endpoint — returns only current user's jobs
    const res = await api.get("/api/jobs");
    return res.data.map((job: any) => ({
      ...job,
      jobId: job.jobId || job.id,
      downloadUrl: job.downloadUrl || job.outputUrl || undefined,
    }));
  },
};

export const usageApi = {
  summary: async (): Promise<UsageSummary> => {
    try {
      // Fetch user's real jobs from the scoped endpoint
      const [jobsRes, keysRes] = await Promise.all([
        api.get("/api/jobs"),
        api.get("/api/keys"),
      ]);
      const jobs: any[] = jobsRes.data || [];
      const keys: any[] = keysRes.data || [];

      const totalPdfs = jobs.length;
      const successCount = jobs.filter((j) => j.status === "done").length;
      const failedCount = jobs.filter((j) => j.status === "failed").length;
      const successRate = totalPdfs > 0 ? (successCount / totalPdfs) * 100 : 100;
      const activeKeys = keys.filter((k) => k.isActive ?? true).length;

      // durationMs isn't stored in the Job entity — approximate from completedAt - createdAt
      const durationsMs = jobs
        .filter((j) => j.status === "done" && j.completedAt && j.createdAt)
        .map((j) => new Date(j.completedAt).getTime() - new Date(j.createdAt).getTime())
        .filter((d) => d > 0 && d < 60000);
      const avgGenTimeMs = durationsMs.length > 0
        ? durationsMs.reduce((a, b) => a + b, 0) / durationsMs.length
        : 0;

      const todayStr = new Date().toDateString();
      const jobsToday = jobs.filter((j) => new Date(j.createdAt).toDateString() === todayStr).length;

      return {
        totalPdfs,
        successRate,
        totalSize: 0, // size not stored in DB
        avgGenTimeMs,
        pdfUsageProgress: totalPdfs,
        pdfLimit: 100,
        activeKeys,
        keysLimit: 5,
        jobsToday,
        jobsTodayTrend: jobsToday > 0 ? `+${jobsToday} today` : "0 today",
      };
    } catch {
      return {
        totalPdfs: 0,
        successRate: 100,
        totalSize: 0,
        avgGenTimeMs: 0,
        pdfUsageProgress: 0,
        pdfLimit: 100,
        activeKeys: 0,
        keysLimit: 5,
        jobsToday: 0,
        jobsTodayTrend: "0 today",
      };
    }
  },

  chartData: async (): Promise<{ usage: UsageChartData[]; speeds: GenerationTimeChartData[] }> => {
    // Build chart from real jobs grouped by day
    try {
      const res = await api.get("/api/jobs");
      const jobs: any[] = res.data || [];

      const dates = Array.from({ length: 15 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (14 - i));
        return d;
      });

      const usage: UsageChartData[] = dates.map((d) => {
        const dateStr = d.toDateString();
        const dayJobs = jobs.filter((j) => new Date(j.createdAt).toDateString() === dateStr);
        return {
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          done: dayJobs.filter((j) => j.status === "done").length,
          failed: dayJobs.filter((j) => j.status === "failed").length,
        };
      });

      const speeds: GenerationTimeChartData[] = dates.map((d) => {
        const dateStr = d.toDateString();
        const dayDone = jobs.filter(
          (j) => j.status === "done" && j.completedAt && new Date(j.completedAt).toDateString() === dateStr
        );
        const avgMs =
          dayDone.length > 0
            ? dayDone.reduce((a, j) => a + (new Date(j.completedAt).getTime() - new Date(j.createdAt).getTime()), 0) / dayDone.length
            : 0;
        return {
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          timeMs: Math.round(avgMs),
        };
      });

      return { usage, speeds };
    } catch {
      const dates = Array.from({ length: 15 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (14 - i));
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      });
      return {
        usage: dates.map((date) => ({ date, done: 0, failed: 0 })),
        speeds: dates.map((date) => ({ date, timeMs: 0 })),
      };
    }
  },
};

export const billingApi = {
  // Plan upgrade stored locally — real Stripe integration would go here
  upgrade: async (plan: "PRO" | "ENTERPRISE"): Promise<User> => {
    const user = tokenHelper.getUser();
    if (!user) throw new Error("Not logged in");
    user.plan = plan;
    tokenHelper.setUser(user);
    return user;
  },
  cancel: async (): Promise<User> => {
    const user = tokenHelper.getUser();
    if (!user) throw new Error("Not logged in");
    user.plan = "FREE";
    tokenHelper.setUser(user);
    return user;
  },
};

export const userApi = {
  me: async (): Promise<User> => {
    const res = await api.get("/api/auth/me");
    const d = res.data;
    const user: User = {
      userId: d.userId,
      email: d.email,
      fullName: d.fullName || d.email?.split("@")[0]?.toUpperCase() || "User",
      plan: (d.plan as any) || "FREE",
      createdAt: d.createdAt,
      company: d.company,
    };
    tokenHelper.setUser(user);
    return user;
  },
};
