"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi, tokenHelper } from "../lib/api";
import { toast } from "sonner";

export function useBilling(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  const upgradeMutation = useMutation({
    mutationFn: billingApi.upgrade,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["usageSummary"] });
      // Upstate stored user context
      tokenHelper.setUser(updatedUser);
      toast.success(`Successfully upgraded to the ${updatedUser.plan} Plan!`);
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err) => {
      toast.error("Failed to upgrade subscription. Please check your payment details.");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: billingApi.cancel,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["usageSummary"] });
      tokenHelper.setUser(updatedUser);
      toast.info("Subscription cancelled. Downgraded to Free Plan.");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err) => {
      toast.error("Failed to cancel subscription.");
    },
  });

  return {
    upgrade: upgradeMutation.mutateAsync,
    isUpgrading: upgradeMutation.isPending,
    cancel: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  };
}
