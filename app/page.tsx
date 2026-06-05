'use client';

import { useState, useEffect } from 'react';
import { Play, Square, Settings, Activity, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';

export default function Dashboard() {
  const [bots, setBots] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const startAllBots = async () => {
    try {
      const res = await fetch('/api/start-bot', { method: 'POST' });
      if (res.ok) {
        setIsRunning(true);
        toast.success('🚀 บอททั้งหมดเริ่มทำงานแล้ว!');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  const stopAllBots = async () => {
    try {
      await fetch('/api/stop-bot', { method: 'POST' });
      setIsRunning(false);
      toast.error('บอทหยุดทำงานแล้ว');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        setBots(data.bots || []);
      } catch (_) {}
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
            <h1 className="text-6xl font-bold tracking-tighter">🎟️ TTM Bot v2.1</h1>
            <p className="text-xl text-zinc-400 mt-2">Ultra Stealth Ticket Bot</p>
          </div>

          <div className="flex items-center gap-3">
            {/* ปุ่ม Live Logs - เพิ่มใหม่ */}
            <Link 
              href="/logs" 
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-6 py-3.5 rounded-2xl font-semibold text-lg transition-colors"
            >
              📜 Live Logs
            </Link>

            <button 
              onClick={startAllBots} 
              disabled={isRunning}
              className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 px-8 py-3.5 rounded-2xl font-semibold text-lg"
            >
              <Play className="w-5 h-5" /> เริ่มบอททั้งหมด
            </button>

            <button 
              onClick={stopAllBots}
              className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-3.5 rounded-2xl font-semibold text-lg"
            >
              <Square className="w-5 h-5" /> หยุดทั้งหมด
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <Activity className="w-6 h-6" />
              <span className="font-medium">บอทที่กำลังทำงาน</span>
            </div>
            <div className="text-7xl font-bold tracking-tighter">{bots.length}</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 text-blue-400 mb-4">
              <Users className="w-6 h-6" />
              <span className="font-medium">บัญชีทั้งหมด</span>
            </div>
            <div className="text-7xl font-bold tracking-tighter">8</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <span className="font-medium">CAPTCHA ที่แก้ได้วันนี้</span>
            </div>
            <div className="text-7xl font-bold tracking-tighter">47</div>
          </div>
        </div>

        {/* Bot Cards */}
        <h2 className="text-3xl font-semibold mb-6">สถานะบอท</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.length > 0 ? (
            bots.map((bot, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold text-2xl">{bot.email}</div>
                    <div className="text-sm text-zinc-400 mt-1">Proxy: {bot.proxy}</div>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-xs font-medium ${bot.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700'}`}>
                    {bot.status}
                  </div>
                </div>
                <div className="mt-8 text-sm space-y-1.5">
                  <div className="flex justify-between"><span className="text-zinc-400">Zone</span> <span>{bot.zone}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Last Action</span> <span>{bot.lastAction}</span></div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-zinc-900 border border-zinc-800 rounded-3xl">
              <p className="text-2xl text-zinc-400">ยังไม่มีบอทที่กำลังทำงาน</p>
              <p className="mt-2 text-zinc-500">กดปุ่ม "เริ่มบอททั้งหมด" เพื่อเริ่ม</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
