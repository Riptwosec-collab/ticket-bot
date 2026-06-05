'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Trash2, Pause, Play } from 'lucide-react';
import Link from 'next/link';

export default function LiveLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const es = new EventSource('/api/logs/stream');
    es.onmessage = (e) => {
      if (!isPaused) {
        try {
          const data = JSON.parse(e.data);
          if (data.line) setLogs(prev => [...prev.slice(-200), data.line]);
        } catch (_) {}
      }
    };
    return () => es.close();
  }, [isPaused]);

  useEffect(() => {
    if (containerRef.current && !isPaused) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft /> กลับ Dashboard
          </Link>
          <div className="flex gap-3">
            <button onClick={() => setIsPaused(!isPaused)} className="px-5 py-2.5 bg-zinc-900 rounded-2xl flex items-center gap-2">
              {isPaused ? <Play /> : <Pause />} {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={() => setLogs([])} className="px-5 py-2.5 bg-red-600 rounded-2xl flex items-center gap-2">
              <Trash2 /> Clear
            </button>
          </div>
        </div>

        <div ref={containerRef} className="bg-black border border-zinc-800 rounded-3xl p-6 h-[78vh] overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-500">รอ log จากบอท...</div>
          ) : (
            logs.map((log, i) => <div key={i} className={log.includes('✅') ? 'text-emerald-400' : log.includes('❌') ? 'text-red-400' : ''}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
