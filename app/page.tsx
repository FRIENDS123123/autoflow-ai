"use client";

import { useState } from "react";
import { Zap, Bot, Puzzle, Rocket, ArrowRight } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  function handleGenerate() {
    if (!prompt.trim()) return;
    alert(`Generating automation for: "${prompt}"`);
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
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40">
          Get Started
        </button>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-20">
          {/* Badge */}
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

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mb-12">
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
                  disabled={!prompt.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40"
                >
                  Generate Automation <Zap size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Example prompts */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl">
            {[
              "Send Slack alert when GitHub PR is opened",
              "Sync Airtable to Notion weekly",
              "Email summary of new Stripe payments daily",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setPrompt(example)}
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white/80 hover:border-white/20 transition-all duration-150"
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        {/* Features */}
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

        {/* CTA Banner */}
        <section className="px-4 pb-24">
          <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-transparent p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Ready to automate your workflow?
            </h2>
            <p className="text-white/50 mb-6 text-sm sm:text-base">
              Join thousands of teams saving hours every week with AutoFlow AI.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40 text-sm sm:text-base">
              Start for free <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-purple-400" />
          <span>
            © {new Date().getFullYear()} AutoFlow AI. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          <a href="#" className="hover:text-white/60 transition-colors">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
