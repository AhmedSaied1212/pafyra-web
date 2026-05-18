"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/lib/validators";
import { z } from "zod";
import { toast } from "sonner";

type ForgotForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Password recovery link dispatched!");
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center gap-6 w-full animate-in fade-in zoom-in-95 duration-300 select-none">
        <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
          <MailCheck className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Link Sent Successfully</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            We've sent a password reset verification link to your email address. Check your inbox to proceed.
          </p>
        </div>
        <Link href="/login" className="w-full">
          <Button variant="outline" className="w-full rounded-xl flex items-center justify-center gap-2 py-5 cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> Return to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your registered email address and we'll dispatch a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            className={`rounded-lg bg-muted/40 border-border/80 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("email")}
            disabled={loading}
          />
          {errors.email && (
            <span className="text-xs text-destructive font-semibold">
              {errors.email.message}
            </span>
          )}
        </div>

        <Button type="submit" className="w-full py-5 font-bold rounded-xl mt-2 cursor-pointer" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1.5">
        <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Return to login
        </Link>
      </div>
    </div>
  );
}
