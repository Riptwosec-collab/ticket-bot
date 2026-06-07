'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Pause, Play, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function LiveLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const events = new EventSource('/api/logs/stream');

    events.onmessage = (event) => {
      if (isPaused) return;

      try {
        const data = JSON.parse(event.data);
        if (data.line) {
          setLogs((previous) => [...previous.slice(-200), data.line]);
        }
      } catch {
        // Ignore malformed SSE messages.
      }
    };

    events.onerror = () => {
      if (!isPaused) {
        setLogs((previous) => [...previous.slice(-200), 'Log stream disconnected. Retrying...']);
      }
    };

    return () => events.close();
  }, [isPaused]);

  useEffect(() => {
    if (containerRef.current && !isPaused) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => setIsPaused((value) => !value)}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 hover:bg-zinc-800"
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={() => setLogs([])}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 hover:bg-red-700"
            >
              <Trash2 className="h-5 w-5" />
              Clear
            </button>
          </div>
        </header>

        <section
          ref={containerRef}
          className="h-[78vh] overflow-y-auto rounded-lg border border-zinc-800 bg-black p-5 font-mono text-sm"
        >
          {logs.length === 0 ? (
            <div className="flex h-full items-center justify-center text-zinc-500">Waiting for logs...</div>
          ) : (
            logs.map((log, index) => (
              <div
                key={`${log}-${index}`}
                className={
                  log.toLowerCase().includes('error')
                    ? 'text-red-400'
                    : log.toLowerCase().includes('success')
                      ? 'text-emerald-400'
                      : 'text-zinc-200'
                }
              >
                {log}
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
