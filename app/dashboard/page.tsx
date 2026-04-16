"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Plus, LogOut, LayoutGrid, Play, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Automation } from "@/lib/database.types";

const APP_ICONS: Record<string, string> = {
  slack: "💬", notion: "📝", github: "🐙", gmail: "📧", sheets: "📊",
  airtable: "🗂️", stripe: "💳", discord: "🎮", trello: "📋",
  twitter: "🐦", webhook: "🔗", ai: "🤖", schedule: "⏰", email: "📨",
};

function getIcon(app: string): string {
  const key = app.toLowerCase();
  for (const [k, v] of Object.entries(APP_ICONS)) {
    if (key.includes(k)) return v;
  }
  return "⚡";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 animate-pulse">
      <div className="h-5 w-2/3 bg-white/10 rounded mb-3" />
      <div className="h-3 w-full bg-white/5 rounded mb-2" />
      <div className="h-3 w-1/2 bg-white/5 rounded mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-12 bg-white/10 rounded-full" />
        <div className="h-6 w-12 bg-white/10 rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-16 bg-white/10 rounded-lg" />
        <div className="h-8 w-16 bg-white/10 rounded-lg" />
        <div className="h-8 w-16 bg-white/10 rounded-lg" />
      </div>
    </div>
  );
}

const EXAMPLE_PROMPTS = [
  {
    label: "Gmail lead → HubSpot + Slack notification",
    prompt: "When I receive a new lead email in Gmail, add the contact to HubSpot CRM and send a notification to Slack",
    emoji: "📧",
  },
  {
    label: "Typeform response → Notion + Email",
    prompt: "When a new Typeform response comes in, create a Notion database entry and send a follow-up email",
    emoji: "📝",
  },
  {
    label: "Stripe payment → Sheets + Thank you email",
    prompt: "When a new Stripe payment is received, log it to Google Sheets and send a thank you email to the customer",
    emoji: "💳",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUser(data.user);
      await fetchAutomations();
      setLoading(false);
    });
  }, [router]);

  async function fetchAutomations() {
    const res = await fetch("/api/automations");
    if (res.ok) {
      const data = await res.json();
      setAutomations(data);
    }
  }

  function handleRun(id: string) {
    setRunningId(id);
    setTimeout(() => setRunningId(null), 4000);
  }

  function handleEdit(automation: Automation) {
    router.push("/?prompt=" + encodeURIComponent(automation.prompt));
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this automation?")) return;
    try {
      const response = await fetch(`/api/automations/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAutomations((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert("Failed to delete. Please try again.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0f]/80">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Zap className="text-purple-400" size={22} />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AutoFlow AI</span>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-8 py-10 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="h-7 w-48 bg-white/10 rounded animate-pulse" />
            <div className="h-9 w-44 bg-white/10 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Run notification bar */}
      {runningId && (
        <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 px-4 py-3 bg-green-500/90 text-white text-sm font-semibold backdrop-blur-sm">
          <CheckCircle2 size={16} />
          Automation is running! Check your connected apps for results.
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-[#0a0a0f]/80">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Zap className="text-purple-400" size={22} />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AutoFlow AI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="hidden sm:block text-xs text-white/50 hover:text-white/80 transition-colors px-2 py-1"
          >
            Pricing
          </Link>
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
            <h1 className="text-xl font-bold">
              {automations.length > 0
                ? `${automations.length} Automation${automations.length !== 1 ? "s" : ""}`
                : "My Automations"}
            </h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40"
          >
            <Plus size={15} />
            Create New Automation
          </Link>
        </div>

        {automations.length === 0 ? (
          /* Welcome empty state */
          <div className="flex flex-col items-center text-center py-16 px-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-3xl">
              👋
            </div>
            <h2 className="font-bold text-2xl mb-2">Welcome to AutoFlow AI!</h2>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-10">
              Create your first automation in 30 seconds. Pick an example below or write your own.
            </p>

            {/* Example cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
              {EXAMPLE_PROMPTS.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => router.push("/?prompt=" + encodeURIComponent(ex.prompt))}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:border-purple-500/40 hover:bg-purple-500/5 p-5 text-left transition-all duration-200 group"
                >
                  <span className="text-2xl mb-3 block">{ex.emoji}</span>
                  <p className="text-sm font-medium text-white/80 group-hover:text-white leading-snug">
                    {ex.label}
                  </p>
                  <p className="text-xs text-purple-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to use this →
                  </p>
                </button>
              ))}
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40"
            >
              <Plus size={14} />
              Create Custom Automation
            </Link>
          </div>
        ) : (
          /* Automations grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3 hover:border-white/20 transition-colors duration-200"
              >
                {/* Title + status */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base leading-snug flex-1">{automation.title}</h3>
                  <span
                    className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      automation.status === "active"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {automation.status === "active" ? "Active" : "Paused"}
                  </span>
                </div>

                {/* Description */}
                {automation.description && (
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
                    {automation.description}
                  </p>
                )}

                {/* App emoji badges */}
                {automation.apps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {automation.apps.map((app) => (
                      <span
                        key={app}
                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/60"
                      >
                        {getIcon(app)} {app}
                      </span>
                    ))}
                  </div>
                )}

                {/* Steps + date */}
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    {automation.steps_count} steps
                  </span>
                  <span>{formatDate(automation.created_at)}</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto pt-1">
                  <button
                    onClick={() => handleRun(automation.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 text-xs font-semibold transition-colors"
                  >
                    <Play size={11} />
                    Run
                  </button>
                  <button
                    onClick={() => handleEdit(automation)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 text-xs font-semibold transition-colors border border-white/10"
                  >
                    <Pencil size={11} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(automation.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors ml-auto"
                  >
                    <Trash2 size={11} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
