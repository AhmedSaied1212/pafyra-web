"use client";

import { useQuery } from "@tanstack/react-query";
import { usageApi } from "../lib/api";

export function useUsage() {
  const { data: summary, isLoading: isSummaryLoading, error: summaryError } = useQuery({
    queryKey: ["usageSummary"],
    queryFn: usageApi.summary,
    refetchInterval: 10000, // refresh stats
  });

  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ["usageCharts"],
    queryFn: usageApi.chartData,
  });

  return {
    summary,
    chartData: chartData?.usage || [],
    speedData: chartData?.speeds || [],
    isLoading: isSummaryLoading || isChartLoading,
    error: summaryError,
  };
}
