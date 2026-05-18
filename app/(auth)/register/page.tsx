"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import { registerSchema } from "@/lib/validators";
import { z } from "zod";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: signup, loading } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  const agreeValue = watch("agree");

  const onSubmit = async (data: RegisterForm) => {
    try {
      await signup(data);
    } catch (err) {
      // toast shown in useUser hook
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Join Pafyra to generate production-ready PDFs from HTML today.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            type="text"
            className={`rounded-lg bg-muted/40 border-border/80 ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...formRegister("fullName")}
            disabled={loading}
          />
          {errors.fullName && (
            <span className="text-xs text-destructive font-semibold">
              {errors.fullName.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            className={`rounded-lg bg-muted/40 border-border/80 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...formRegister("email")}
            disabled={loading}
          />
          {errors.email && (
            <span className="text-xs text-destructive font-semibold">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              className={`rounded-lg bg-muted/40 border-border/80 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...formRegister("password")}
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && (
            <span className="text-xs text-destructive font-semibold">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type={showConfirmPassword ? "text" : "password"}
              className={`rounded-lg bg-muted/40 border-border/80 pr-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...formRegister("confirmPassword")}
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-destructive font-semibold">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Terms agreement checkbox */}
        <div className="flex flex-col gap-1.5 mt-1 select-none">
          <div className="flex items-center gap-2.5">
            <input
              id="agree"
              type="checkbox"
              className="h-4.5 w-4.5 rounded border-border bg-muted/40 text-primary focus:ring-primary focus:ring-opacity-50 cursor-pointer"
              checked={agreeValue}
              onChange={(e) => setValue("agree", e.target.checked, { shouldValidate: true })}
              disabled={loading}
            />
            <Label htmlFor="agree" className="text-xs font-semibold text-muted-foreground cursor-pointer leading-normal">
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline font-bold">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline font-bold">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.agree && (
            <span className="text-xs text-destructive font-semibold">
              {errors.agree.message}
            </span>
          )}
        </div>

        <Button type="submit" className="w-full py-5 font-bold rounded-xl mt-2 cursor-pointer" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
