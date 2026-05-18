"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User as UserIcon,
  Key,
  Laptop,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Shield,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { profileSchema, changePasswordSchema } from "@/lib/validators";
import { z } from "zod";
import { toast } from "sonner";

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const { user, updateProfile, logout } = useUser();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Profile hook-form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      company: user?.company || "",
    },
  });

  // Password hook-form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSave = (data: ProfileForm) => {
    updateProfile(data.fullName, data.company);
  };

  const onPasswordSave = (data: PasswordForm) => {
    toast.success("Security password changed successfully!");
    resetPasswordForm();
  };

  const handleDeleteAccount = () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleteOpen(false);
      toast.info("Account terminated. Hope to see you again!");
      logout();
    }, 2000);
  };

  const activeSessions = [
    { ip: "192.168.1.47", device: "Chrome / Linux (Ubuntu)", status: "Active Session", date: "Current session" },
    { ip: "82.47.19.120", device: "Safari / Apple iOS (iPhone)", status: "Authorized", date: "May 15, 2026 at 10:22 AM" },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 select-none">
      <Tabs defaultValue="profile" className="w-full flex flex-col gap-6">
        {/* Navigation Tabs headers */}
        <TabsList className="bg-card/50 border border-border/80 p-1 rounded-xl self-start">
          <TabsTrigger value="profile" className="rounded-lg text-xs font-semibold px-4 py-2 cursor-pointer">
            <UserIcon className="h-3.5 w-3.5 mr-1.5" /> Profile Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg text-xs font-semibold px-4 py-2 cursor-pointer">
            <Key className="h-3.5 w-3.5 mr-1.5" /> Security & Pass
          </TabsTrigger>
          <TabsTrigger value="sessions" className="rounded-lg text-xs font-semibold px-4 py-2 cursor-pointer">
            <Laptop className="h-3.5 w-3.5 mr-1.5" /> Active Sessions
          </TabsTrigger>
          <TabsTrigger value="danger" className="rounded-lg text-xs font-semibold px-4 py-2 text-rose-500 data-[state=active]:bg-rose-500/10 data-[state=active]:text-rose-500 cursor-pointer">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" /> Danger Zone
          </TabsTrigger>
        </TabsList>

        {/* ────────────────── PROFILE PARAMETERS TAB ────────────────── */}
        <TabsContent value="profile" className="outline-none">
          <Card className="border border-border/80 bg-card/45 backdrop-blur-sm rounded-xl">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground">Profile Parameters</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Manage public display settings</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-6">
              <form onSubmit={handleProfileSubmit(onProfileSave)} className="flex flex-col gap-5 max-w-lg">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="profile-name">Full Display Name</Label>
                  <Input
                    id="profile-name"
                    className="rounded-lg bg-muted/40 border-border/80 text-sm"
                    {...registerProfile("fullName")}
                  />
                  {profileErrors.fullName && (
                    <span className="text-xs text-destructive font-semibold">{profileErrors.fullName.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="profile-company">Company / Organization</Label>
                  <Input
                    id="profile-company"
                    placeholder="Optional"
                    className="rounded-lg bg-muted/40 border-border/80 text-sm"
                    {...registerProfile("company")}
                  />
                </div>

                <Button type="submit" className="rounded-xl px-6 self-start font-semibold cursor-pointer">
                  Save Details
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ────────────────── SECURITY TAB ────────────────── */}
        <TabsContent value="security" className="outline-none">
          <Card className="border border-border/80 bg-card/45 backdrop-blur-sm rounded-xl">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground">Change Account Password</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Secure your login details</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-6">
              <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="flex flex-col gap-5 max-w-lg">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="current-pass">Current Password</Label>
                  <Input
                    id="current-pass"
                    type="password"
                    placeholder="••••••••"
                    className="rounded-lg bg-muted/40 border-border/80 text-sm"
                    {...registerPassword("currentPassword")}
                  />
                  {passwordErrors.currentPassword && (
                    <span className="text-xs text-destructive font-semibold">{passwordErrors.currentPassword.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-pass">New Secure Password</Label>
                  <Input
                    id="new-pass"
                    type="password"
                    placeholder="••••••••"
                    className="rounded-lg bg-muted/40 border-border/80 text-sm"
                    {...registerPassword("newPassword")}
                  />
                  {passwordErrors.newPassword && (
                    <span className="text-xs text-destructive font-semibold">{passwordErrors.newPassword.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="confirm-pass">Confirm New Password</Label>
                  <Input
                    id="confirm-pass"
                    type="password"
                    placeholder="••••••••"
                    className="rounded-lg bg-muted/40 border-border/80 text-sm"
                    {...registerPassword("confirmPassword")}
                  />
                  {passwordErrors.confirmPassword && (
                    <span className="text-xs text-destructive font-semibold">{passwordErrors.confirmPassword.message}</span>
                  )}
                </div>

                <Button type="submit" className="rounded-xl px-6 self-start font-semibold cursor-pointer">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ────────────────── SESSIONS TAB ────────────────── */}
        <TabsContent value="sessions" className="outline-none">
          <Card className="border border-border/80 bg-card/45 backdrop-blur-sm rounded-xl">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground">Authorized Active Sessions</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Devices currently authenticated to your account</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-4">
              {activeSessions.map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/80">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-muted-foreground" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-foreground">{session.device}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        IP: {session.ip} • {session.date}
                      </span>
                    </div>
                  </div>
                  <Badge variant={idx === 0 ? "default" : "outline"} className={`text-[9px] uppercase tracking-wider rounded-full px-2.5 py-0.5 ${idx === 0 ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 border-emerald-500/20" : ""}`}>
                    {session.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ────────────────── DANGER ZONE TAB ────────────────── */}
        <TabsContent value="danger" className="outline-none">
          <Card className="border border-rose-500/40 bg-rose-500/[0.01] rounded-xl">
            <CardHeader className="border-b border-rose-500/10 pb-4">
              <CardTitle className="text-base font-bold text-rose-500 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Account Danger Zone
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Highly destructive account actions</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-6 flex flex-col gap-6 items-start">
              <div className="flex flex-col gap-2 max-w-xl text-left">
                <h4 className="text-sm font-bold text-foreground">Terminate Platform Account</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By deleting your account, you will instantly revoke and erase all enqueued PDF transaction history ledger records, cancel your subscription billing setups, and delete all generated SHA-256 API credentials. This action is **permanent** and cannot be restored.
                </p>
              </div>

              <Button
                variant="destructive"
                className="rounded-xl font-bold px-6 cursor-pointer"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ────────────────── DANGER ZONE TERMINATION DIALOG ────────────────── */}
      <Dialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="text-base font-bold text-rose-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Terminate Account permanently?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Confirm permanent system deletion</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you absolutely positive you want to completely erase your account? All keys will be invalidated immediately, enqueued databases cleared, and billing setups terminated. 
            </p>

            <div className="flex justify-end gap-3 mt-4 border-t border-border/40 pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl cursor-pointer"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="rounded-xl cursor-pointer font-bold"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
                Erase Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
