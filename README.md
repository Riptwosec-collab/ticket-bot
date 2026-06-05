# 🎟️ TTM Ticket Bot v2.0 - คู่มือการใช้งานฉบับสมบูรณ์

## ฟีเจอร์หลัก v2.0
- ✅ Stealth ขั้นสูง (Mouse, Fingerprint, Random behavior)
- ✅ CAPTCHA Solver อัตโนมัติ (CapSolver)
- ✅ Proxy Rotation + Health Check
- ✅ Multi-Account Login + Session Persistence
- ✅ Queue Position Monitor
- ✅ Desktop Notification + Sound Alert
- ✅ Auto Select Zone + Auto Buy
- ✅ รองรับ ThaiTicketMajor + Ticketmelon
- ✅ Logging แบบละเอียด + บันทึก session

## การติดตั้ง
1. `npm install`
2. คัดลอก `.env.example` เป็น `.env` แล้วใส่ข้อมูล
3. `node ttm-ticket-bot-v2.js`

## หน้าอธิบายการใช้งาน

### 1. การตั้งค่า .env
- `CAPSOLVER_API_KEY` → สำคัญที่สุดสำหรับแก้ CAPTCHA
- `PROXIES` → ใช้ Residential Proxy ไทย
- `ACCOUNTS` → ใส่หลายบัญชีได้
- `HEADLESS=false` → แนะนำให้เห็นเบราว์เซอร์

### 2. การรันบอท
- เปิด Terminal แล้วพิมพ์ `node ttm-ticket-bot-v2.js`
- กด F9 (ถ้าใช้ Userscript) หรือดู log ใน terminal

### 3. การใช้งานขั้นสูง
- เปลี่ยน `TARGET_ZONE` เป็นชื่อโซนที่ต้องการ (VIP, CAT1, A1 ฯลฯ)
- เปิดหลาย Terminal เพื่อรันหลายบัญชีพร้อมกัน
- ดู log ได้ที่โฟลเดอร์ `logs/`

### 4. คำเตือนความปลอดภัย
- ใช้ด้วยความเสี่ยงของคุณเอง
- TTM มีระบบตรวจจับบอทเข้มงวด
- ไม่แนะนำให้ใช้เพื่อ scalping จำนวนมาก

## การอัพเกรดเป็น Dashboard (Next.js)
ต้องการเวอร์ชันมี UI Dashboard ไหม? บอกได้เลย
