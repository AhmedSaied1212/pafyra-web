"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle,
  HardDrive,
  Download,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Shield,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import { useBilling } from "@/hooks/useBilling";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export default function BillingPage() {
  const { user } = useUser();
  const { summary, isLoading } = useUsage();
  
  // Confetti callback upgrade
  const { upgrade, cancel, isUpgrading } = useBilling(() => {
    if (user?.plan === "FREE") {
      // Trigger canvas confetti shower!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#4F46E5", "#7C3AED", "#10B981", "#3B82F6"],
      });
    }
  });

  // Stripe Upgrade Dialog state
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner text="Consulting ledger balances..." />
      </div>
    );
  }

  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc) {
      toast.error("Please fill out all billing fields");
      return;
    }

    try {
      await upgrade("PRO");
      setUpgradeOpen(false);
      setCardNumber("");
      setExpiry("");
      setCvc("");
    } catch (err) {
      // toast shown in useBilling
    }
  };

  const invoices = [
    { id: "INV-0092", date: "May 01, 2026", status: "Paid", amount: "$19.00", link: "#" },
    { id: "INV-0047", date: "Apr 01, 2026", status: "Paid", amount: "$19.00", link: "#" },
    { id: "INV-0012", date: "Mar 01, 2026", status: "Paid", amount: "$19.00", link: "#" },
  ];

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header and description */}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">
          Manage subscriptions, limits billing cycles, payment setups, and receipts.
        </p>
      </div>

      {/* Plan limits meters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Progress meters left */}
        <div className="md:col-span-8 flex flex-col gap-6">
          <Card className="border border-border/80 bg-card/45 backdrop-blur-sm rounded-xl">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground">Usage Quota Meter</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Monthly enqueued renders tracking details</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-5 pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-foreground">Monthly PDFs Volume</span>
                  <span className="text-muted-foreground">
                    {summary?.pdfUsageProgress || 0} / {user?.plan === "PRO" ? "Unlimited" : (summary?.pdfLimit || 100)} enqueues
                  </span>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${user?.plan === "PRO" ? 5 : ((summary?.pdfUsageProgress || 0) / (summary?.pdfLimit || 100) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-normal">
                  {user?.plan === "PRO" ? "High volume pro quota active" : "Approaching 100 free compilation caps"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan card summary right */}
        <div className="md:col-span-4">
          <Card className="border border-primary bg-card/65 rounded-xl shadow-xl relative overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
                Current Plan <Badge className="rounded-full text-[9px] uppercase tracking-wider">{user?.plan}</Badge>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Active platform tier details</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex flex-col gap-6 select-none">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground tracking-tight">
                  {user?.plan === "FREE" ? "$0" : "$19"}
                </span>
                <span className="text-muted-foreground text-sm font-medium">/ month</span>
              </div>

              {user?.plan === "FREE" ? (
                <Button className="w-full rounded-xl py-5 shadow-lg shadow-indigo-500/10 cursor-pointer font-bold" onClick={() => setUpgradeOpen(true)}>
                  <Sparkles className="h-4.5 w-4.5 mr-2 fill-white animate-pulse" /> Upgrade to Pro
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full rounded-xl py-5 hover:bg-rose-500/5 hover:text-rose-500 hover:border-rose-500/20 cursor-pointer font-semibold"
                  onClick={() => cancel()}
                >
                  Cancel Pro Subscription
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Paginated invoices history table */}
      <Card className="border border-border/80 bg-card/25 backdrop-blur-sm rounded-2xl overflow-hidden mt-2">
        <CardHeader className="bg-muted/20 border-b border-border/60">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" /> Invoice Receipts History
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Browse and download billing details</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/60 hover:bg-transparent">
              <TableHead className="font-semibold text-xs py-4 px-6 text-foreground/80 uppercase">Invoice ID</TableHead>
              <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Billing Date</TableHead>
              <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Total Amount</TableHead>
              <TableHead className="font-semibold text-xs py-4 px-4 text-foreground/80 uppercase">Payment Status</TableHead>
              <TableHead className="font-semibold text-xs py-4 px-6 text-right uppercase">Receipt Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user?.plan === "PRO" ? (
              invoices.map((inv) => (
                <TableRow key={inv.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold py-4 px-6 text-foreground">
                    {inv.id}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-xs font-semibold text-muted-foreground">
                    {inv.date}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-sm font-semibold text-foreground">
                    {inv.amount}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <Badge variant="outline" className="rounded-md border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[10px] uppercase font-bold py-0.5">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80 rounded-lg text-muted-foreground hover:text-foreground">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-xs text-muted-foreground/60 italic font-semibold">
                  No invoices compiled. Subscription invoices will only be recorded once upgrading to the Pro Plan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ────────────────── STRIPE MOCK UPGRADE DIALOG ────────────────── */}
      <Dialog open={upgradeOpen} onOpenChange={(open) => !open && setUpgradeOpen(false)}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Secure Stripe Payment Gateway
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Upgrade securely to Pafyra Pro ($19.00/mo)</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpgradeSubmit} className="flex flex-col gap-4 mt-3">
            {/* Card Number */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stripe-card">Credit Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
                <Input
                  id="stripe-card"
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="pl-10 rounded-lg bg-muted/40 border-border/80 text-sm"
                  disabled={isUpgrading}
                  maxLength={19}
                />
              </div>
            </div>

            {/* Expiry + CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="stripe-expiry">Expiry Date</Label>
                <Input
                  id="stripe-expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="rounded-lg bg-muted/40 border-border/80 text-sm"
                  disabled={isUpgrading}
                  maxLength={5}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="stripe-cvc">Security CVC</Label>
                <Input
                  id="stripe-cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="rounded-lg bg-muted/40 border-border/80 text-sm"
                  disabled={isUpgrading}
                  maxLength={4}
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/30 border text-[10px] text-muted-foreground font-semibold leading-relaxed mt-1">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500 flex-shrink-0" />
              <span>This is a mock Stripe checkout sandbox. Enter any credentials parameters to simulate a successful payment transition.</span>
            </div>

            <div className="flex justify-end gap-3 mt-4 border-t border-border/40 pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl cursor-pointer"
                onClick={() => setUpgradeOpen(false)}
                disabled={isUpgrading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl cursor-pointer font-bold"
                disabled={isUpgrading}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Upgrading...
                  </>
                ) : (
                  "Pay & Subscribe"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
