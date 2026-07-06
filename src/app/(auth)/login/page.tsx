/* eslint-disable react/no-unescaped-entities */
"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { useAuth, UserRole } from "@/context/AuthContext";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setGeneralError(result.error || "Login failed. Please check your credentials.");
        toast.error(result.error || "Login failed. Please check your credentials.");
      } else {
        toast.success("Login successful!");
      }
    } catch (err) {
      setGeneralError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setGeneralError("");
    setIsSubmitting(true);
    try {
      const result = await demoLogin(role);
      if (!result.success) {
        setGeneralError(result.error || "Demo login failed.");
        toast.error(result.error || "Demo login failed.");
      } else {
        toast.success(`Demo login successful as ${role}!`);
      }
    } catch (err) {
      setGeneralError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-secondary relative p-4">
      {/* Floating Theme Toggle in top-right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl p-8 relative overflow-hidden backdrop-blur-sm">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your collaborative workspace</p>
        </div>

        {generalError && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/15 border border-destructive/30 flex items-start gap-3 text-destructive relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span className="text-sm font-medium">{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email Address
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              type="email"
              id="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                {errors.email}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
            </div>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                {errors.password}
              </span>
            )}
          </div>

          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full shadow-sm hover:shadow-md"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
               <div className="flex items-center gap-2">
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Signing in...
               </div>
            ) : "Sign In"}
          </button>
        </form>

        <div className="relative my-8 z-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium">Or Quick Demo Login</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 z-10 relative">
          <button
            className="flex flex-col items-center justify-center py-3 px-2 rounded-lg border border-border bg-background hover:bg-secondary/80 hover:border-primary/30 transition-all shadow-sm group"
            onClick={() => handleDemoLogin("ADMIN")}
          >
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Admin</span>
            <span className="text-[10px] text-muted-foreground mt-1 hidden sm:block">Full system</span>
          </button>

          <button
            className="flex flex-col items-center justify-center py-3 px-2 rounded-lg border border-border bg-background hover:bg-secondary/80 hover:border-primary/30 transition-all shadow-sm group"
            onClick={() => handleDemoLogin("MANAGER")}
          >
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Manager</span>
            <span className="text-[10px] text-muted-foreground mt-1 hidden sm:block">Create tasks</span>
          </button>

          <button
            className="flex flex-col items-center justify-center py-3 px-2 rounded-lg border border-border bg-background hover:bg-secondary/80 hover:border-primary/30 transition-all shadow-sm group"
            onClick={() => handleDemoLogin("EMPLOYEE")}
          >
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Member</span>
            <span className="text-[10px] text-muted-foreground mt-1 hidden sm:block">Update own</span>
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6 z-10 relative">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
