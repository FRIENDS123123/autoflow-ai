import Link from "next/link";
import { Zap } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0f]/80">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Zap className="text-purple-400" size={22} />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AutoFlow AI
          </span>
        </Link>
      </header>
      <main className="flex-1 max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: April 2026</p>
        <div className="flex flex-col gap-8 text-white/60 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-base mb-2">Acceptance of Terms</h2>
            <p>By using AutoFlow AI you agree to these terms. If you do not agree, please do not use the service.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">Use of Service</h2>
            <p>AutoFlow AI is provided for lawful automation purposes only. You may not use the platform to violate any applicable laws, send spam, or interfere with other users.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">Your Content</h2>
            <p>You retain ownership of the automations and data you create. By using the service you grant AutoFlow AI a limited licence to store and process your content to deliver the service.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">Termination</h2>
            <p>You may delete your account at any time. We reserve the right to suspend accounts that violate these terms.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">Contact</h2>
            <p>Questions? Email us at legal@autoflow.ai</p>
          </section>
        </div>
        <Link href="/" className="inline-block mt-12 text-sm text-purple-400 hover:text-purple-300 transition-colors">
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
