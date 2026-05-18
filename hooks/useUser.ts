"use client";

import { useState, useEffect } from "react";
import { authApi, tokenHelper, userApi } from "../lib/api";
import { User } from "../types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = tokenHelper.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    // Try to get real user from backend; fall back to localStorage cache
    userApi.me()
      .then((u) => { setUser(u); })
      .catch(() => {
        const cached = tokenHelper.getUser();
        if (cached) setUser(cached);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (data: any) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      if (res.token) {
        const currentUser = tokenHelper.getUser();
        setUser(currentUser);
        toast.success("Welcome back! Signed in successfully.");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials, please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      await authApi.register(data);
      const currentUser = tokenHelper.getUser();
      setUser(currentUser);
      toast.success("Account created! Welcome to Pafyra.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed, email might be in use.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    tokenHelper.clearToken();
    setUser(null);
    toast.info("Signed out successfully.");
    router.push("/login");
  };

  const updateProfile = (fullName: string, company?: string) => {
    const u = tokenHelper.getUser();
    if (u) {
      u.fullName = fullName;
      u.company = company;
      tokenHelper.setUser(u);
      setUser(u);
      toast.success("Profile details updated successfully!");
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };
}
