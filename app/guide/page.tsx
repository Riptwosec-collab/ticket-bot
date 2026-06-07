'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, ShieldAlert, Terminal } from 'lucide-react';

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <BookOpen className="h-8 w-8" />
            Project Guide
          </h1>
        </header>

        <div className="space-y-8">
          <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <Terminal className="h-5 w-5 text-emerald-400" />
              Run the dashboard
            </h2>
            <div className="space-y-3 text-zinc-300">
              <p>Install dependencies, then start the local Next.js server.</p>
              <pre className="overflow-x-auto rounded-lg bg-black p-4 text-emerald-400">npm install{'\n'}npm run dev</pre>
              <p>Open the app at http://localhost:3000.</p>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">Live logs</h2>
            <p className="text-zinc-300">
              The Logs page streams lines from <code className="rounded bg-zinc-800 px-2 py-0.5">logs/bot.log</code>.
              If the file does not exist yet, the page stays open and waits instead of crashing.
            </p>
          </section>

          <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">Real-time account status</h2>
            <p className="text-zinc-300">
              The dashboard polls <code className="rounded bg-zinc-800 px-2 py-0.5">status.json</code> every few
              seconds. Use one top-level key per account email, with <code>email</code>, <code>event</code>,
              <code>status</code>, <code>lastAction</code>, and <code>timestamp</code> fields.
            </p>
          </section>

          <section className="rounded-lg border border-amber-800 bg-amber-950/40 p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-300" />
              <div>
                <h2 className="mb-2 text-xl font-semibold text-amber-100">Important limitation</h2>
                <p className="text-sm text-amber-100/80">
                  This cleaned-up build keeps the dashboard, status endpoints, and log viewer working. It does not
                  enable automated CAPTCHA solving, stealth browsing, or automatic ticket purchasing.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
