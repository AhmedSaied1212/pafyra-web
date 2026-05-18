"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileCode2,
  FileText,
  KeyRound,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  User as UserIcon,
  Bell,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/Logo";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, isAuthenticated } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LoadingSpinner text="Authenticating session..." />
      </div>
    );
  }

  const menuItems = [
    { label: "Overview", icon: <LayoutDashboard className="h-4.5 w-4.5" />, href: "/dashboard" },
    { label: "PDF Compiler", icon: <FileCode2 className="h-4.5 w-4.5" />, href: "/dashboard/generate" },
    { label: "Jobs History", icon: <FileText className="h-4.5 w-4.5" />, href: "/dashboard/jobs" },
    { label: "API Keys", icon: <KeyRound className="h-4.5 w-4.5" />, href: "/dashboard/api-keys" },
    { label: "Analytics", icon: <BarChart3 className="h-4.5 w-4.5" />, href: "/dashboard/usage" },
    { label: "Billing Board", icon: <CreditCard className="h-4.5 w-4.5" />, href: "/dashboard/billing" },
    { label: "API Docs", icon: <BookOpen className="h-4.5 w-4.5" />, href: "/dashboard/docs" },
    { label: "Settings", icon: <Settings className="h-4.5 w-4.5" />, href: "/dashboard/settings" },
  ];

  const getPageTitle = () => {
    const active = menuItems.find((item) => pathname === item.href);
    return active ? active.label : "Dashboard";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-md border-r border-border/80 relative">
      {/* Sidebar Header Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border/60">
        <Link href="/" className="cursor-pointer">
          <Logo showText={!collapsed} className="h-7 w-auto" />
        </Link>
      </div>

      {/* Navigation Options */}
      <nav className="flex-grow py-6 px-4 flex flex-col gap-1.5 select-none">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              <div
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer User controls */}
      <div className="p-4 border-t border-border/60 flex flex-col gap-3 select-none">
        {!collapsed && user?.plan === "FREE" && (
          <Link href="/dashboard/billing">
            <div className="bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20 rounded-xl p-3 flex flex-col gap-2 hover:border-primary/40 transition-colors cursor-pointer">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 fill-primary" /> Free Limits
              </span>
              <span className="text-xs text-muted-foreground leading-normal">
                Upgrade to Pro for unlimited generation and priority queue access.
              </span>
            </div>
          </Link>
        )}

        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl px-3.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 font-semibold cursor-pointer"
          onClick={logout}
        >
          <LogOut className="h-4.5 w-4.5 mr-3" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Dynamic glow overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-primary/3 to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 left-[250px] w-[400px] h-[400px] bg-radial from-violet-500/3 to-transparent pointer-events-none z-0" />

      {/* ────────────────── DESKTOP SIDEBAR ────────────────── */}
      <aside
        className={`hidden lg:block h-full transition-all duration-300 relative z-20 flex-shrink-0 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />

        {/* Collapse Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-3.5 top-20 h-7 w-7 rounded-full border border-border/80 bg-card hover:bg-muted/80 z-30 cursor-pointer shadow-md"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </aside>

      {/* ────────────────── CORE CONTENT WRAPPER ────────────────── */}
      <div className="flex-grow flex flex-col h-full overflow-hidden relative z-10">
        {/* Dynamic upper header */}
        <header className="h-16 border-b border-border/60 bg-card/20 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0 select-none">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 rounded-lg hover:bg-muted/80">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-card">
                <SheetTitle className="sr-only">Dashboard Navigation Drawer</SheetTitle>
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-bold tracking-tight text-foreground">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Plan Badge */}
            <Badge
              variant={user?.plan === "FREE" ? "outline" : "default"}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border-border/60 ${
                user?.plan === "PRO" ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10" : ""
              }`}
            >
              {user?.plan} PLAN
            </Badge>

            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted/80 relative text-muted-foreground hover:text-foreground">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 rounded-lg cursor-pointer border border-border/60 hover:border-primary/40 transition-all select-none">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-heading font-extrabold text-sm uppercase">
                    {user?.fullName.split(" ").map((w) => w[0]).join("") || "US"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border border-border/80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-foreground leading-none">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground leading-none mt-0.5">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem asChild className="hover:bg-muted cursor-pointer font-semibold rounded-lg m-1">
                  <Link href="/dashboard/settings" className="flex w-full items-center">
                    <UserIcon className="mr-2.5 h-4 w-4 text-muted-foreground" /> Profile settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-muted cursor-pointer font-semibold rounded-lg m-1">
                  <Link href="/dashboard/billing" className="flex w-full items-center">
                    <CreditCard className="mr-2.5 h-4 w-4 text-muted-foreground" /> Subscription & billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem
                  className="hover:bg-rose-500/5 text-rose-500 cursor-pointer font-semibold rounded-lg m-1"
                  onClick={logout}
                >
                  <LogOut className="mr-2.5 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Main Children Screen */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8 relative">{children}</main>
      </div>
    </div>
  );
}
