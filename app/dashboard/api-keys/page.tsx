"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Plus,
  Trash2,
  AlertTriangle,
  Copy,
  Eye,
  Calendar,
  AlertCircle,
  EyeOff,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApiKeys } from "@/hooks/useApiKeys";
import { formatDate } from "@/lib/utils";
import { KeyMask } from "@/components/shared/KeyMask";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

export default function ApiKeysPage() {
  const { keys, createKey, isCreating, revokeKey, isRevoking, isLoading } = useApiKeys();

  // Create Key modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  // Revoke Key modal state
  const [revokeTargetId, setRevokeTargetId] = useState<string | null>(null);
  const [revokeTargetLabel, setRevokeTargetLabel] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner text="Retrieving secure credentials..." />
      </div>
    );
  }

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelInput.trim()) {
      toast.error("Please enter a descriptive label for the API key");
      return;
    }

    try {
      const result = await createKey(labelInput);
      setLabelInput("");
      setCreateOpen(false);
      // Display newly created key prominently
      setNewlyCreatedKey(result.key || null);
    } catch (err) {
      // toast shown in useApiKeys
    }
  };

  const handleRevokeConfirm = async () => {
    if (!revokeTargetId) return;

    try {
      await revokeKey(revokeTargetId);
      setRevokeTargetId(null);
    } catch (err) {
      // toast shown in useApiKeys
    }
  };

  const handleCopyNewKey = async () => {
    if (!newlyCreatedKey) return;
    await navigator.clipboard.writeText(newlyCreatedKey);
    toast.success("API key copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Generate secure, hashed API credentials to access our Puppeteer processing nodes.
        </p>
        <Button className="rounded-xl shadow-lg shadow-indigo-500/10 cursor-pointer font-semibold" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4.5 w-4.5 mr-2" /> Generate Key
        </Button>
      </div>

      {/* Prominent Newly Created Key Callout */}
      {newlyCreatedKey && (
        <Card className="border-2 border-emerald-500 bg-emerald-500/[0.03] rounded-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <CardContent className="p-6 md:p-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
              <CheckCircle className="h-5 w-5" /> API Key Created Successfully
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your new credential has been generated. For security reasons, **we only show this key once**. Copy it immediately and save it in your environment variables. You will not be able to retrieve it again.
            </p>

            <div className="flex items-center gap-3 bg-card border border-border/80 p-3.5 rounded-xl font-mono text-sm text-foreground/90 select-all overflow-x-auto relative">
              <span className="truncate pr-16">{newlyCreatedKey}</span>
              <Button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg"
                size="sm"
                onClick={handleCopyNewKey}
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Key
              </Button>
            </div>

            <Button
              variant="ghost"
              className="self-end text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setNewlyCreatedKey(null)}
            >
              I have stored this key securely
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Keys List Grid */}
      {keys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {keys.map((key) => (
            <Card key={key.keyId} className="border border-border/80 bg-card/45 backdrop-blur-sm rounded-xl">
              <CardContent className="p-6 flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate max-w-[200px]">{key.label}</h3>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Generated {formatDate(key.createdAt)}
                    </span>
                  </div>
                  
                  <Badge
                    variant={key.isActive ? "default" : "outline"}
                    className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      key.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""
                    }`}
                  >
                    {key.isActive ? "Active" : "Revoked"}
                  </Badge>
                </div>

                {/* Secure Mask Preview */}
                <KeyMask
                  value={key.key || key.prefix}
                  isRevealable={!!key.key}
                />

                {/* Usage metrics per key */}
                <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4 text-xs font-semibold text-muted-foreground">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider">Total Generates</span>
                    <span className="text-sm font-bold text-foreground">{key.usageCount} PDFs</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-right">
                    <span className="text-[9px] font-bold uppercase tracking-wider">Quota limit</span>
                    <span className="text-sm font-bold text-foreground">/{key.monthlyLimit} limit</span>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-4 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-semibold italic">
                    {key.lastUsed ? `Last active ${formatDate(key.lastUsed)}` : "Never activated"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/5 cursor-pointer"
                    onClick={() => {
                      setRevokeTargetId(key.keyId);
                      setRevokeTargetLabel(key.label);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Revoke Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<KeyRound className="h-6 w-6" />}
          title="No API Keys Generated"
          description="You don't have any active API credentials enqueued. Generate your first SHA-256 API key to connect your application client nodes!"
          action={
            <Button size="sm" className="rounded-lg" onClick={() => setCreateOpen(true)}>Generate First Key</Button>
          }
        />
      )}

      {/* ────────────────── CREATE KEY DIALOG ────────────────── */}
      <Dialog open={createOpen} onOpenChange={(open) => !open && setCreateOpen(false)}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="text-base font-bold text-foreground">Generate New API Credential</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Authorize programmatic renders with hashed custom tokens</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGenerateKey} className="flex flex-col gap-4 mt-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="key-label">Descriptive Name / Label</Label>
              <Input
                id="key-label"
                placeholder="e.g. Production Invoices Key"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                className="rounded-lg bg-muted/40 border-border/80 text-sm"
                disabled={isCreating}
              />
              <span className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                Assign a recognizable label to easily identify where and how this credential token will be enqueued.
              </span>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl cursor-pointer"
                onClick={() => setCreateOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl cursor-pointer"
                disabled={isCreating}
              >
                {isCreating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
                Generate Token
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ────────────────── DESTRUCTIVE REVOKE CONFIRM DIALOG ────────────────── */}
      <Dialog open={!!revokeTargetId} onOpenChange={(open) => !open && setRevokeTargetId(null)}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="text-base font-bold text-rose-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Revoke Hashed Key?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">This is a highly destructive system action</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you absolutely sure you want to revoke the credential **"{revokeTargetLabel}"**? 
              Once revoked, any active application nodes or curls enqueuing renders using this token will **fail instantly** with an unauthorized 401 response code. This action is final and cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl cursor-pointer"
                onClick={() => setRevokeTargetId(null)}
                disabled={isRevoking}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="rounded-xl cursor-pointer font-bold"
                onClick={handleRevokeConfirm}
                disabled={isRevoking}
              >
                {isRevoking ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
                Revoke Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
