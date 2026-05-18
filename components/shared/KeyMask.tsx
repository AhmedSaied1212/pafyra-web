"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./CopyButton";
import { toast } from "sonner";

interface KeyMaskProps {
  /** The raw full key (only available right after creation), OR just the prefix. */
  value: string;
  /** If true, the value IS the complete raw key and can be revealed/copied. */
  isRevealable?: boolean;
}

export function KeyMask({ value, isRevealable = false }: KeyMaskProps) {
  const [visible, setVisible] = useState(false);

  // If we only have the prefix, build the display string
  const displayMasked = isRevealable
    ? `${value.substring(0, 16)}${"•".repeat(24)}`
    : `${value}${"•".repeat(24)}`;

  const displayValue = isRevealable && visible ? value : displayMasked;

  return (
    <div className="flex items-center gap-2 font-mono text-sm bg-muted/40 px-3 py-1.5 rounded-lg border border-border/80 max-w-full overflow-hidden select-none">
      <span className="truncate text-foreground/90 font-medium flex-1">
        {displayValue}
      </span>
      <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
        {isRevealable ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted/80 rounded-lg"
              onClick={() => setVisible(!visible)}
              aria-label={visible ? "Hide key" : "Reveal key"}
            >
              {visible ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <CopyButton value={value} toastMessage="API key copied to clipboard!" />
          </>
        ) : (
          // Key was already dismissed — only prefix is stored, raw key is gone
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg cursor-not-allowed opacity-50"
            onClick={() =>
              toast.info("The raw key is only shown once at creation for security. Create a new key if needed.")
            }
            aria-label="Key not revealable"
          >
            <Lock className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  );
}
