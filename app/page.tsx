"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Bot, Puzzle, Rocket, ArrowRight, ChevronDown, Play, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeType = "trigger" | "action" | "ai";

interface WorkflowNode {
  id: number;
  type: NodeType;
  app: string;
  label: string;
  detail: string;
}

// ─── Mock generator ───────────────────────────────────────────────────────────

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

const NODE_BORDER: Record<NodeType, string> = {
  trigger: "border-l-green-400",
  action: "border-l-purple-400",
  ai: "border-l-blue-400",
};

const NODE_BADGE: Record<NodeType, string> = {
  trigger: "bg-green-500/20 text-green-300",
  action: "bg-purple-500/20 text-purple-300",
  ai: "bg-blue-500/20 text-blue-300",
};

const NODE_BADGE_LABEL: Record<NodeType, string> = {
  trigger: "Trigger",
  action: "Action",
  ai: "AI Step",
};

function generateNodes(input: string): WorkflowNode[] {
  const t = input.toLowerCase();

  // Detect apps from input
  const hasSlack = t.includes("slack");
  const hasNotion = t.includes("notion");
  const hasGithub = t.includes("github") || t.includes("pr") || t.includes("pull request");
  const hasGmail = t.includes("gmail") || t.includes("email") || t.includes("mail");
  const hasSheets = t.includes("sheet") || t.includes("google sheet");
  const hasAirtable = t.includes("airtable");
  const hasStripe = t.includes("stripe") || t.includes("payment");
  const hasDiscord = t.includes("discord");
  const hasSchedule = t.includes("daily") || t.includes("weekly") || t.includes("every") || t.includes("schedule");

  const nodes: WorkflowNode[] = [];

  // Node 1 — Trigger
  if (hasGithub) {
    nodes.push({ id: 1, type: "trigger", app: "GitHub", label: "New Pull Request Opened", detail: "Fires when a PR is opened, edited, or labeled in your repo" });
  } else if (hasSheets) {
    nodes.push({ id: 1, type: "trigger", app: "Google Sheets", label: "New Row Added", detail: "Fires when a new row is appended to the selected spreadsheet" });
  } else if (hasStripe) {
    nodes.push({ id: 1, type: "trigger", app: "Stripe", label: "New Payment Received", detail: "Fires on every successful charge.succeeded event" });
  } else if (hasAirtable) {
    nodes.push({ id: 1, type: "trigger", app: "Airtable", label: "New Record Created", detail: "Fires when a record is added to the selected base & table" });
  } else if (hasSchedule) {
    nodes.push({ id: 1, type: "trigger", app: "Schedule", label: t.includes("daily") ? "Every Day at 9 AM" : "Every Monday at 9 AM", detail: "Runs on a fixed recurring schedule" });
  } else {
    nodes.push({ id: 1, type: "trigger", app: "Webhook", label: "Incoming Webhook", detail: "Fires when a POST request is received at your endpoint" });
  }

  // Node 2 — AI Step
  nodes.push({
    id: 2, type: "ai", app: "AI",
    label: "Analyze & Summarize",
    detail: "Claude reads the incoming data and produces a concise structured summary",
  });

  // Node 3+ — Actions
  if (hasSlack) {
    nodes.push({ id: 3, type: "action", app: "Slack", label: "Send Channel Message", detail: "Posts the AI summary to #alerts or any channel you choose" });
  }
  if (hasNotion) {
    nodes.push({ id: nodes.length + 1, type: "action", app: "Notion", label: "Create Notion Page", detail: "Creates a new page in your workspace with the AI-generated content" });
  }
  if (hasGmail) {
    nodes.push({ id: nodes.length + 1, type: "action", app: "Gmail", label: "Send Email", detail: "Sends a formatted HTML email to the specified recipients" });
  }
  if (hasDiscord) {
    nodes.push({ id: nodes.length + 1, type: "action", app: "Discord", label: "Post to Channel", detail: "Sends an embed message to the selected Discord channel" });
  }
  if (hasAirtable && !hasSheets) {
    nodes.push({ id: nodes.length + 1, type: "action", app: "Airtable", label: "Update Record", detail: "Writes the processed result back to the Airtable record" });
  }
  if (hasSheets && hasNotion) {
    // already added Notion above, skip duplicate
  }

  // Always end with a log/confirm step if we only have 2 nodes so far
  if (nodes.length === 2) {
    nodes.push({ id: 3, type: "action", app: "Slack", label: "Send Notification", detail: "Posts a summary notification to your team's Slack channel" });
  }

  // Cap at 5
  return nodes.slice(0, 5).map((n, i) => ({ ...n, id: i + 1 }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  async function handleDeploy() {
    setSaveState("saving");
    setSaveError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const uniqueApps = Array.from(new Set(nodes.map((n) => n.app)));
    const title = prompt.length > 60 ? prompt.slice(0, 57) + "..." : prompt;

    const res = await fetch("/api/automations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: "",
        prompt,
        nodes,
        apps: uniqueApps,
        steps_count: nodes.length,
      }),
    });

    if (res.ok) {
      setSaveState("saved");
    } else {
      const json = await res.json().catch(() => ({}));
      setSaveError(json.error ?? "Failed to save automation.");
      setSaveState("error");
    }
  }

  function handleGenerate() {
    if (!prompt.trim() || status === "loading") return;
    setStatus("loading");
    setNodes([]);
    setVisibleCount(0);
    setSaveState("idle");
    setSaveError("");

    setTimeout(() => {
      const generated = generateNodes(prompt);
      setNodes(generated);
      setStatus("done");
    }, 2000);
  }

  // Stagger node fade-in
  useEffect(() => {
    if (status !== "done" || nodes.length === 0) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= nodes.length) clearInterval(timer);
    }, 180);
    return () => clearInterval(timer);
  }, [status, nodes]);

  const uniqueApps = Array.from(new Set(nodes.map((n) => n.app)));

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
        <Link
          href="/signup"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/30"
        >
          Get Started
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium">
            <Zap size={12} />
            Powered by Claude AI
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight max-w-4xl mb-6">
            Automate Anything{" "}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              With One Sentence
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mb-10">
            Describe what you want to automate. AI builds it instantly.{" "}
            <span className="text-white/70">No coding required.</span>
          </p>

          {/* Input Box */}
          <div className="w-full max-w-2xl">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl shadow-purple-900/20 focus-within:border-purple-500/50 transition-all duration-300">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
                }}
                placeholder="e.g. When a new row is added to Google Sheets, send a Slack message and create a Notion page..."
                rows={3}
                className="w-full bg-transparent text-white placeholder-white/30 text-sm sm:text-base px-5 pt-4 pb-3 resize-none outline-none rounded-t-2xl"
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-white/20 text-xs">Ctrl+Enter to generate</span>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || status === "loading"}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40"
                >
                  {status === "loading" ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>Generate Automation <Zap size={14} /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Example chips */}
          <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-2xl">
            {[
              "Send Slack alert when GitHub PR is opened",
              "Sync Airtable to Notion weekly",
              "Email summary of new Stripe payments daily",
            ].map((example) => (
              <button
                key={example}
                onClick={() => { setPrompt(example); setStatus("idle"); setNodes([]); }}
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white/80 hover:border-white/20 transition-all duration-150"
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        {/* ── Loading state ── */}
        {status === "loading" && (
          <section className="px-4 pb-16">
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-purple-500/40 border-t-purple-400 rounded-full animate-spin" />
              <p className="text-white/50 text-sm animate-pulse">
                AI is analyzing your automation...
              </p>
            </div>
          </section>
        )}

        {/* ── Workflow result ── */}
        {status === "done" && nodes.length > 0 && (
          <section className="px-4 pb-20">
            <div className="max-w-2xl mx-auto">
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <span className="text-sm font-semibold text-white/80">
                    Automation Generated
                  </span>
                </div>
                <button
                  onClick={() => { setStatus("idle"); setNodes([]); setPrompt(""); setSaveState("idle"); setSaveError(""); }}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  ✕ Clear
                </button>
              </div>

              {/* Workflow nodes */}
              <div className="flex flex-col gap-0">
                {nodes.map((node, idx) => (
                  <div key={node.id}>
                    {/* Node card */}
                    <div
                      className={`rounded-xl border border-white/10 border-l-4 ${NODE_BORDER[node.type]} bg-white/5 px-5 py-4 transition-all duration-500 ${
                        idx < visibleCount
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl leading-none mt-0.5">{getIcon(node.app)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${NODE_BADGE[node.type]}`}>
                              {NODE_BADGE_LABEL[node.type]}
                            </span>
                            <span className="text-white/40 text-xs">{node.app}</span>
                          </div>
                          <p className="font-semibold text-sm text-white">{node.label}</p>
                          <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{node.detail}</p>
                        </div>
                        <span className="text-white/20 text-xs mt-1">#{idx + 1}</span>
                      </div>
                    </div>

                    {/* Arrow connector */}
                    {idx < nodes.length - 1 && (
                      <div
                        className={`flex justify-center py-1 transition-all duration-500 delay-75 ${
                          idx + 1 < visibleCount ? "opacity-40" : "opacity-0"
                        }`}
                      >
                        <ChevronDown size={16} className="text-white/40" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary panel */}
              <div
                className={`mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-blue-900/20 px-6 py-5 transition-all duration-700 ${
                  visibleCount >= nodes.length ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">Steps</p>
                      <p className="text-xl font-bold">{nodes.length}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">Apps</p>
                      <p className="text-xl font-bold">{uniqueApps.length}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-0.5">Status</p>
                      <p className="text-sm font-semibold text-green-400">Ready</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDeploy}
                    disabled={saveState === "saving" || saveState === "saved"}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40"
                  >
                    {saveState === "saving" ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Saving automation...
                      </>
                    ) : (
                      <>
                        <Play size={13} />
                        Deploy Automation
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-3 text-white/30 text-xs">
                  Connected apps: {uniqueApps.join(" · ")}
                </p>

                {saveState === "saved" && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2">
                    <p className="text-green-400 text-xs font-medium">
                      Automation saved!
                    </p>
                    <Link href="/dashboard" className="text-green-300 text-xs underline underline-offset-2 hover:text-green-200">
                      View in dashboard →
                    </Link>
                  </div>
                )}

                {saveState === "error" && (
                  <p className="mt-3 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {saveError}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Features — hide when result is showing */}
        {status === "idle" && (
          <>
            <section className="px-4 pb-24">
              <div className="max-w-5xl mx-auto">
                <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-10 font-semibold">
                  Why AutoFlow AI
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: <Bot size={24} className="text-purple-400" />,
                      title: "AI Powered",
                      desc: "Claude AI understands your intent and generates production-ready automation workflows instantly.",
                      color: "from-purple-900/30 to-purple-800/10",
                      border: "border-purple-500/20",
                    },
                    {
                      icon: <Puzzle size={24} className="text-blue-400" />,
                      title: "500+ Integrations",
                      desc: "Connect Slack, Notion, Airtable, GitHub, Stripe, Google Workspace, and hundreds more.",
                      color: "from-blue-900/30 to-blue-800/10",
                      border: "border-blue-500/20",
                    },
                    {
                      icon: <Rocket size={24} className="text-cyan-400" />,
                      title: "Deploy in Seconds",
                      desc: "One click to deploy. Your automations run in the cloud — no servers, no maintenance.",
                      color: "from-cyan-900/30 to-cyan-800/10",
                      border: "border-cyan-500/20",
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className={`rounded-2xl border ${card.border} bg-gradient-to-br ${card.color} p-6 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}
                    >
                      <div className="mb-4 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        {card.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="px-4 pb-24">
              <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-transparent p-10 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  Ready to automate your workflow?
                </h2>
                <p className="text-white/50 mb-6 text-sm sm:text-base">
                  Join thousands of teams saving hours every week with AutoFlow AI.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40 text-sm sm:text-base"
                >
                  Start for free <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-purple-400" />
          <span>© {new Date().getFullYear()} AutoFlow AI. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          <a href="#" className="hover:text-white/60 transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
