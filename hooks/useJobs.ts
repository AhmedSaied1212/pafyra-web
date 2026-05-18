"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pdfApi } from "../lib/api";
import { toast } from "sonner";

export function useJobs() {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: pdfApi.listAll,
    refetchInterval: 15000, // auto refetch history
  });

  const submitMutation = useMutation({
    mutationFn: pdfApi.generate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.info("PDF generation job submitted...");
    },
    onError: (err) => {
      toast.error("Failed to submit PDF job");
    },
  });

  return {
    jobs,
    isLoading,
    error,
    submitJob: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    submittedJobData: submitMutation.data,
  };
}
