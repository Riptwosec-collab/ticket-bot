'use client';

import { useEffect, useState } from 'react';
import { Activity, BookOpen, FileText, Play, ShieldAlert, Square, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type BotStatus = {
  email: string;
  event?: string;
  status: string;
  lastAction: string;
  timestamp?: string;
};

type BotStatusMap = Record<string, BotStatus>;

export default function Dashboard() {
  const [bots, setBots] = useState<BotStatusMap>({});
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('Ready');
  const botList = Object.values(bots);

  async function refreshStatus() {
    const res = await fetch('/api/status', { cache: 'no-store' });
    const data = await res.json();
    setBots(data.bots || {});
    setIsRunning(Boolean(data.isRunning));
    setMessage(data.message || 'Ready');
  }

  const startAllBots = async () => {
    try {
      const res = await fetch('/api/start-bot', { method: 'POST' });
      const data = await res.json();
      setMessage(data.message || 'Start request completed');
      await refreshStatus();
    } catch {
      setMessage('Unable to send start request.');
    }
  };

  const stopAllBots = async () => {
    try {
      const res = await fetch('/api/stop-bot', { method: 'POST' });
      const data = await res.json();
      setMessage(data.message || 'Stopped');
      await refreshStatus();
    } catch {
      setMessage('Unable to send stop request.');
    }
  };

  useEffect(() => {
    refreshStatus().catch(() => undefined);
    const interval = setInterval(() => {
      refreshStatus().catch(() => undefined);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-normal md:text-5xl">Ticket Bot Dashboard</h1>
            <p className="mt-2 text-lg text-zinc-400">Local control panel and live log viewer</p>
          </div>

          <nav className="flex flex-wrap items-center gap-3">
            <Link
              href="/logs"
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 font-semibold hover:bg-zinc-800"
            >
              <FileText className="h-5 w-5" />
              Live Logs
            </Link>

            <Link
              href="/guide"
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 font-semibold hover:bg-zinc-800"
            >
              <BookOpen className="h-5 w-5" />
              Guide
            </Link>

            <button
              onClick={startAllBots}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-700 disabled:opacity-60"
            >
              <Play className="h-5 w-5" />
              Start
            </button>

            <button
              onClick={stopAllBots}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold hover:bg-red-700"
            >
              <Square className="h-5 w-5" />
              Stop
            </button>
          </nav>
        </header>

        <section className="mb-8 rounded-lg border border-amber-800 bg-amber-950/40 p-5 text-amber-100">
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold">Automation guard enabled</h2>
              <p className="mt-1 text-sm text-amber-100/80">
                The dashboard is usable, but automated CAPTCHA solving and automatic ticket purchasing are disabled.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-3 flex items-center gap-3 text-emerald-400">
              <Activity className="h-6 w-6" />
              <span className="font-medium">Running processes</span>
            </div>
            <div className="text-5xl font-bold">{botList.filter((bot) => bot.status === 'running').length}</div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-3 flex items-center gap-3 text-sky-400">
              <Users className="h-6 w-6" />
              <span className="font-medium">Configured accounts</span>
            </div>
            <div className="text-5xl font-bold">{botList.length}</div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-3 text-zinc-400">Last message</div>
            <p className="min-h-16 text-base text-zinc-200">{message}</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Real-time Account Status</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {botList.length > 0 ? (
              botList.map((bot, index) => (
                <motion.div
                  key={`${bot.email}-${index}`}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xl font-semibold">{bot.email}</div>
                      <div className="mt-1 truncate text-sm text-zinc-400">{bot.event || 'No event URL'}</div>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        bot.status === 'running'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {bot.status}
                    </div>
                  </div>
                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-400">Last action</span>
                      <span className="text-right font-medium">{bot.lastAction}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-xs text-zinc-500">
                      <span>Updated</span>
                      <span>
                        {bot.timestamp
                          ? new Date(bot.timestamp).toLocaleTimeString('th-TH')
                          : 'unknown'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
                <h3 className="text-2xl font-semibold">No account status yet</h3>
                <p className="mt-2 text-zinc-400">Write account states to status.json to show them here.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
