"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Check, X, LogOut, LayoutGrid, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const FREE_FEATURES = [
  { text: "3 automations", included: true },
  { text: "All app integrations", included: true },
  { text: "Visual workflow builder", included: true },
  { text: "Basic support", included: true },
  { text: "Unlimited automations", included: false },
  { text: "Priority support", included: false },
  { text: "API access", included: false },
];

const PRO_FEATURES = [
  { text: "Unlimited automations", included: true },
  { text: "All app integrations", included: true },
  { text: "Visual workflow builder", included: true },
  { text: "Priority support", included: true },
  { text: "API access", included: true },
  { text: "Advanced analytics", included: true },
  { text: "Custom webhooks", included: true },
];

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel anytime directly from your dashboard. No questions asked.",
  },
  {
    q: "What apps are supported?",
    a: "500+ apps including Gmail, Slack, Notion, HubSpot, GitHub, Airtable, Stripe, Discord, and many more.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — the Free plan is free forever with up to 3 automations. No credit card required.",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-[#0a0a0f]/80">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Zap className="text-purple-400" size={22} />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AutoFlow AI
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="hidden sm:block text-xs text-purple-400 font-semibold px-3 py-1.5">
            Pricing
          </Link>
          {user ? (
            <>
              <span className="hidden sm:block text-xs text-white/40 border border-white/10 rounded-lg px-3 py-1.5 bg-white/5">
                {user.email}
              </span>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-xs font-semibold transition-all duration-200"
              >
                <LayoutGrid size={13} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all duration-150"
              >
                <LogOut size={13} />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/30"
            >
              Get Started
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-20">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            Simple,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h1>
          <p className="text-white/50 text-lg">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 items-start mb-20">
          {/* Free card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Free</h2>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-extrabold">$0</span>
                <span className="text-white/40 mb-2">/ month</span>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {FREE_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  {f.included ? (
                    <Check size={15} className="text-green-400 shrink-0" />
                  ) : (
                    <X size={15} className="text-white/20 shrink-0" />
                  )}
                  <span className={f.included ? "text-white/80" : "text-white/25"}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-auto w-full text-center px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-semibold transition-all duration-200"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro card */}
          <div className="rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-900/30 to-blue-900/20 p-8 flex flex-col gap-6 shadow-xl shadow-purple-900/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-bold shadow-lg shadow-purple-900/40">
                Most Popular
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Pro</h2>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-extrabold">$29</span>
                <span className="text-white/40 mb-2">/ month</span>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {PRO_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  <Check size={15} className="text-green-400 shrink-0" />
                  <span className="text-white/80">{f.text}</span>
                </li>
              ))}
            </ul>
            <button className="mt-auto w-full text-center px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40">
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-center text-xl font-bold mb-8 text-white/80">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-left hover:bg-white/5 transition-colors"
                >
                  {faq.q}
                  <ChevronDown
                    size={15}
                    className={`text-white/40 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-white/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-purple-400" />
          <span>© {new Date().getFullYear()} AutoFlow AI. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
          <Link href="/pricing" className="hover:text-white/60 transition-colors">Pricing</Link>
        </div>
      </footer>
    </div>
  );
}
