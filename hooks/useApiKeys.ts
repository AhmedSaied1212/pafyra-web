"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keysApi } from "../lib/api";
import { toast } from "sonner";

export function useApiKeys() {
  const queryClient = useQueryClient();

  const { data: keys = [], isLoading, error } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: keysApi.list,
  });

  const createMutation = useMutation({
    mutationFn: keysApi.create,
    onSuccess: (newKey) => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      toast.success("New API key generated!");
    },
    onError: (err) => {
      toast.error("Failed to generate API key");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: keysApi.revoke,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      toast.success("API key revoked successfully");
    },
    onError: (err) => {
      toast.error("Failed to revoke API key");
    },
  });

  return {
    keys,
    isLoading,
    error,
    createKey: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createdKeyData: createMutation.data,
    revokeKey: revokeMutation.mutateAsync,
    isRevoking: revokeMutation.isPending,
  };
}
