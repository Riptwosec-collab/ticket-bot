'use client';

import { useState, useEffect } from 'react';
import { Play, Square, Settings, Activity, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';

export default function Dashboard() {
  const [bots, setBots] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const startAllBots = async () => {
    const res = await fetch('/api/start-bot', { method: 'POST' });
    if (res.ok) {
      setIsRunning(true);
      toast.success('บอททั้งหมดเริ่มทำงานแล้ว!');
    }
  };

  const stopAllBots = async () => {
    await fetch('/api/stop-bot', { method: 'POST' });
    setIsRunning(false);
    toast.error('บอททั้งหมดหยุดแล้ว');
  };

  // โหลดสถานะบอททุก 3 วินาที
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/status');
      const data = await res.json();
      setBots(data.bots || []);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <Toaster position="top-center" richColors />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">🎟️ TTM Bot v2.1</h1>
            <p className="text-zinc-400 mt-2">Ultra Stealth Concert Ticket Bot Dashboard</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={startAllBots}
              disabled={isRunning}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-2xl font-semibold disabled:opacity-50"
            >
              <Play className="w-5 h-5" /> เริ่มบอททั้งหมด
            </button>
            <button
              onClick={stopAllBots}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-semibold"
            >
              <Square className="w-5 h-5" /> หยุดทั้งหมด
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 rounded-3xl p-6">
            <div className="flex items-center gap-3 text-emerald-400">
              <Activity className="w-6 h-6" />
              <span className="font-medium">บอทที่กำลังทำงาน</span>
            </div>
            <div className="text-6xl font-bold mt-4">{bots.length}</div>
          </div>
          <div className="bg-zinc-900 rounded-3xl p-6">
            <div className="flex items-center gap-3 text-blue-400">
              <Users className="w-6 h-6" />
              <span className="font-medium">บัญชีทั้งหมด</span>
            </div>
            <div className="text-6xl font-bold mt-4">8</div>
          </div>
          <div className="bg-zinc-900 rounded-3xl p-6">
            <div className="text-amber-400 font-medium">CAPTCHA ที่แก้ได้วันนี้</div>
            <div className="text-6xl font-bold mt-4">47</div>
          </div>
        </div>

        {/* Bot Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.length > 0 ? (
            bots.map((bot, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold text-lg">{bot.email}</div>
                    <div className="text-sm text-zinc-400">Proxy: {bot.proxy}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${bot.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700'}`}>
                    {bot.status}
                  </div>
                </div>
                <div className="mt-6 text-sm text-zinc-400">Zone: {bot.zone}</div>
                <div className="mt-1 text-sm text-zinc-400">Last action: {bot.lastAction}</div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-zinc-500">
              ยังไม่มีบอทที่กำลังทำงาน<br />กดปุ่ม "เริ่มบอททั้งหมด" เพื่อเริ่ม
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
