"use client";

import Link from "next/link";
import { Zap, Bot, Puzzle, Rocket, ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Zap className="text-purple-400" size={24} />
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          AutoFlow AI
        </span>
      </Link>

      {/* Hero */}
      <div className="text-center max-w-lg mb-12">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
          Welcome to AutoFlow AI!
        </h1>
        <p className="text-white/50 text-lg mb-2">Your account is ready.</p>
        <p className="text-white/40 text-sm">
          Check your email to confirm your account, then create your first automation below.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/"
        className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-semibold text-base transition-all duration-200 shadow-xl shadow-purple-900/40 mb-16"
      >
        Create My First Automation
        <ArrowRight size={18} />
      </Link>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
        {[
          {
            icon: <Bot size={22} className="text-purple-400" />,
            title: "AI-Powered",
            desc: "Just describe what you want. Claude AI builds the full workflow for you.",
            bg: "from-purple-900/30 to-purple-800/10",
            border: "border-purple-500/20",
          },
          {
            icon: <Puzzle size={22} className="text-blue-400" />,
            title: "500+ Integrations",
            desc: "Connect Gmail, Slack, Notion, Airtable, Stripe, GitHub, and hundreds more.",
            bg: "from-blue-900/30 to-blue-800/10",
            border: "border-blue-500/20",
          },
          {
            icon: <Rocket size={22} className="text-cyan-400" />,
            title: "Deploy in Seconds",
            desc: "One click to go live. Runs in the cloud 24/7 — no servers needed.",
            bg: "from-cyan-900/30 to-cyan-800/10",
            border: "border-cyan-500/20",
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl border ${card.border} bg-gradient-to-br ${card.bg} p-5`}
          >
            <div className="mb-3 w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
              {card.icon}
            </div>
            <h3 className="font-bold text-sm mb-1">{card.title}</h3>
            <p className="text-white/50 text-xs leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
