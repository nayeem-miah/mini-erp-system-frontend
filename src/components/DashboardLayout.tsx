/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Secure route protection
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Auto-close sidebar on mobile navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading || !isAuthenticated || !user) {
    return <Loader minHeight="h-screen" className="bg-background" size="lg" />;
  }

  const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";

  // Check if link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-1 flex-col gap-8 h-full">
      {/* Logo Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 px-2 text-2xl font-bold tracking-tight text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Mini ERP</span>
        </div>

        {/* Close Drawer Button for mobile */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden rounded-full p-2 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              href="/"
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:scale-110"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive("/products")
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:scale-110"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link
              href="/categories"
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive("/categories")
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:scale-110"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
              <span>Categories</span>
            </Link>
          </li>
          <li>
            <Link
              href="/sales"
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive("/sales")
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:scale-110"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              <span>Sales</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer Profile & Logout */}
      <div className="mt-auto flex flex-col gap-4 border-t pt-6">
        <div className="flex items-center gap-3 rounded-xl border bg-background/50 p-3 shadow-sm backdrop-blur transition-colors hover:bg-accent/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20">
            {avatarLetter}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold leading-tight">{user.name}</span>
            <span className="truncate text-xs font-medium text-muted-foreground">{user.role}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground hover:shadow-md"
          title="Log out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/30 flex-col md:flex-row relative">
      {/* Mobile Top Header */}
      <header className="flex md:hidden items-center justify-between border-b bg-card px-5 py-4 shadow-sm w-full shrink-0">
        <div className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-primary">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Mini ERP</span>
        </div>

        {/* Menu Button Toggle */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-lg border p-2 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile Drawer Slide-out Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
        />
      )}

      {/* Mobile Slide-out Drawer Panel */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 z-50 bg-card px-5 py-6 border-r shadow-2xl flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {renderSidebarContent(true)}
      </aside>

      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card px-4 py-6 shadow-sm z-10 shrink-0">
        {renderSidebarContent(false)}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-7 md:p-8 lg:p-10 w-full">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:gap-8">
          {children}
        </div>
      </main>
    </div>
  );
}
