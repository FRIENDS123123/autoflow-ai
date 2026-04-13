"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Plus, LogOut, LayoutGrid } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-purple-500/40 border-t-purple-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-[#0a0a0f]/80">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Zap className="text-purple-400" size={22} />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AutoFlow AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-white/40 border border-white/10 rounded-lg px-3 py-1.5 bg-white/5">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all duration-150"
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-8 py-10 max-w-5xl mx-auto w-full">
        {/* Page heading */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutGrid size={20} className="text-purple-400" />
            <h1 className="text-xl font-bold">My Automations</h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40"
          >
            <Plus size={15} />
            Create New Automation
          </Link>
        </div>

        {/* Empty state */}
        <div className="rounded-2xl border border-white/10 border-dashed bg-white/[0.02] flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
            <Zap size={24} className="text-purple-400" />
          </div>
          <h2 className="font-bold text-lg mb-2">No automations yet</h2>
          <p className="text-white/40 text-sm max-w-xs leading-relaxed mb-6">
            No automations yet. Create your first one!
          </p>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40"
          >
            <Plus size={14} />
            Create New Automation
          </Link>
        </div>
      </main>
    </div>
  );
}
