import Link from "next/link";
import { Zap } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: April 2026</p>
        <div className="flex flex-col gap-8 text-white/60 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-base mb-2">Information We Collect</h2>
            <p>We collect your email address when you sign up, and the automation prompts and workflow data you create within the platform.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">How We Use Your Data</h2>
            <p>Your data is used solely to provide the AutoFlow AI service — storing your automations, authenticating your account, and improving the platform. We never sell your data to third parties.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">Data Storage</h2>
            <p>All data is stored securely via Supabase with row-level security policies ensuring only you can access your own automations.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">Contact</h2>
            <p>Questions about privacy? Reach us at privacy@autoflow.ai</p>
          </section>
        </div>
        <Link href="/" className="inline-block mt-12 text-sm text-purple-400 hover:text-purple-300 transition-colors">
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
