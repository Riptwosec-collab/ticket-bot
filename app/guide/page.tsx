'use client'

import Link from 'next/link'
import { ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react'

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft /> กลับ Dashboard
          </Link>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <BookOpen className="w-9 h-9" /> วิธีใช้งาน TTM Bot v2.1
          </h1>
        </div>

        <div className="space-y-10">
          {/* ขั้นตอนที่ 1 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">1</span>
              การติดตั้งครั้งแรก
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3 text-zinc-300">
              <p>1. Clone โปรเจกต์หรือดาวน์โหลดจาก GitHub</p>
              <p>2. เปิดโฟลเดอร์ใน Terminal แล้วรันคำสั่ง:</p>
              <pre className="bg-black p-4 rounded-xl text-emerald-400">npm install</pre>
            </div>
          </div>

          {/* ขั้นตอนที่ 2 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">2</span>
              การตั้งค่า
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="mb-3">คัดลอกไฟล์ <code className="bg-zinc-800 px-2 py-0.5 rounded">.env.example</code> เป็น <code className="bg-zinc-800 px-2 py-0.5 rounded">.env</code> แล้วแก้ไขข้อมูลดังนี้:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                <li><strong>CAPSOLVER_API_KEY</strong> — API Key จาก CapSolver (สำคัญมาก)</li>
                <li><strong>PROXIES</strong> — ใส่ Residential Proxy (แนะนำใช้ Proxy ไทย)</li>
                <li><strong>ACCOUNTS</strong> — ใส่บัญชีหลายตัวได้</li>
                <li><strong>EVENT_URL</strong> — ลิงก์หน้าขายบัตรคอนเสิร์ต</li>
                <li><strong>TARGET_ZONE</strong> — ชื่อโซนที่ต้องการ (เช่น VIP, CAT1)</li>
              </ul>
            </div>
          </div>

          {/* ขั้นตอนที่ 3 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">3</span>
              การรันบอท
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div>
                <p className="font-medium mb-2">รันบอทหลัก (ttm-ticket-bot-v2.js)</p>
                <pre className="bg-black p-4 rounded-xl text-emerald-400">node ttm-ticket-bot-v2.js</pre>
              </div>
              <div>
                <p className="font-medium mb-2">รัน Dashboard (เว็บควบคุม)</p>
                <pre className="bg-black p-4 rounded-xl text-emerald-400">npm run dev</pre>
                <p className="text-sm text-zinc-400 mt-1">แล้วเปิดเบราว์เซอร์ที่ <span className="text-white">http://localhost:3000</span></p>
              </div>
            </div>
          </div>

          {/* คำเตือน */}
          <div className="bg-red-950/50 border border-red-900 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-400 mb-2">คำเตือนสำคัญ</h3>
                <ul className="text-sm text-red-300 space-y-1">
                  <li>• การใช้บอทอาจผิดเงื่อนไขของเว็บขายบัตร</li>
                  <li>• อาจถูกแบนบัญชีหรือ IP</li>
                  <li>• ใช้เพื่อการศึกษาและทดสอบเท่านั้น</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
