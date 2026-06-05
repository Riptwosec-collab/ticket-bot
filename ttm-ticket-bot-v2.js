// ttm-ticket-bot-v2.js
require('dotenv').config();
const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
chromium.use(StealthPlugin());

const axios = require('axios');
const notifier = require('node-notifier');
const player = require('play-sound')();
const fs = require('fs');
const path = require('path');

const CAPSOLVER_KEY = process.env.CAPSOLVER_API_KEY;
const proxies = (process.env.PROXIES || '').split(',').filter(Boolean);
const accounts = JSON.parse(process.env.ACCOUNTS || '[]');
const EVENT_URL = process.env.EVENT_URL;
const TARGET_ZONE = process.env.TARGET_ZONE || 'VIP';
const PLATFORM = process.env.PLATFORM || 'TTM';
const HEADLESS = process.env.HEADLESS === 'true';
const ENABLE_SOUND = process.env.ENABLE_SOUND !== 'false';
const ENABLE_NOTIFICATION = process.env.ENABLE_NOTIFICATION !== 'false';
const SESSION_PERSIST = process.env.SESSION_PERSIST !== 'false';

let proxyIndex = 0;
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

function log(msg, level = 'INFO') {
  const time = new Date().toLocaleTimeString('th-TH');
  const line = `[${time}] [${level}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(logDir, 'bot.log'), line + '\n');
}

function playAlert() {
  if (!ENABLE_SOUND) return;
  try { player.play('https://www.soundjay.com/buttons/beep-07.mp3'); } catch (e) {}
}

function sendNotification(title, message) {
  if (!ENABLE_NOTIFICATION) return;
  notifier.notify({ title, message, sound: true });
}

async function solveCaptcha(page) {
  log('🔄 พบ CAPTCHA กำลังแก้...', 'CAPTCHA');
  try {
    const siteKey = await page.evaluate(() => {
      const el = document.querySelector('.g-recaptcha, [data-sitekey]');
      return el ? el.getAttribute('data-sitekey') : null;
    });
    if (!siteKey) return false;

    const task = {
      clientKey: CAPSOLVER_KEY,
      task: { type: "ReCaptchaV2TaskProxyLess", websiteURL: page.url(), websiteKey: siteKey }
    };

    const res = await axios.post('https://api.capsolver.com/createTask', task);
    const taskId = res.data.taskId;

    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 3500));
      const result = await axios.post('https://api.capsolver.com/getTaskResult', { clientKey: CAPSOLVER_KEY, taskId });
      if (result.data.status === 'ready') {
        const token = result.data.solution.gRecaptchaResponse;
        await page.evaluate(t => {
          const ta = document.querySelector('[name="g-recaptcha-response"]');
          if (ta) ta.value = t;
        }, token);
        log('✅ CAPTCHA แก้สำเร็จ!', 'SUCCESS');
        playAlert();
        sendNotification('CAPTCHA Solved', 'บอทแก้ CAPTCHA สำเร็จแล้ว');
        return true;
      }
    }
  } catch (e) { log('CAPTCHA Error: ' + e.message, 'ERROR'); }
  return false;
}

async function getBrowser(account) {
  const proxy = proxies[proxyIndex % proxies.length] || '';
  proxyIndex++;

  const browser = await chromium.launch({
    headless: HEADLESS,
    args: proxy ? [`--proxy-server=${proxy}`] : [],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1280 + Math.floor(Math.random()*100), height: 800 + Math.floor(Math.random()*50) },
    locale: 'th-TH',
  });

  // Advanced Stealth
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    // Random fingerprint
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
  });

  const page = await context.newPage();

  // Human-like behavior
  await page.mouse.move(Math.random() * 1200, Math.random() * 700);

  // Login
  const loginUrl = PLATFORM === 'TTM' ? 'https://www.thaiticketmajor.com/login' : 'https://www.ticketmelon.com/login';
  await page.goto(loginUrl, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"], input[name="email"]', account.email);
  await page.type('input[type="password"]', account.pass, { delay: 80 + Math.random() * 120 });
  await page.click('button[type="submit"], button:contains("เข้าสู่ระบบ"), button:contains("Login")');
  await page.waitForTimeout(4500);

  // Session Persistence
  if (SESSION_PERSIST) {
    const statePath = path.join(logDir, `${account.email.replace(/[@.]/g, '_')}.json`);
    await context.storageState({ path: statePath });
    log(`💾 บันทึก session สำหรับ ${account.email}`);
  }

  return { browser, page, context, proxy };
}

async function runBot() {
  if (!EVENT_URL || accounts.length === 0) {
    log('❌ กรุณาตั้ง EVENT_URL และ ACCOUNTS ใน .env', 'ERROR');
    return;
  }

  log('🚀 เริ่มบอท v2.0 - รวมทุกฟีเจอร์', 'START');

  for (const account of accounts) {
    const { page, proxy } = await getBrowser(account);
    log(`บอทเริ่มทำงาน: ${account.email} | Proxy: ${proxy} | Zone: ${TARGET_ZONE}`);

    await page.goto(EVENT_URL, { waitUntil: 'networkidle' });

    const interval = setInterval(async () => {
      try {
        // 1. CAPTCHA
        if (await page.locator('.g-recaptcha, iframe[src*="recaptcha"]').count() > 0) {
          await solveCaptcha(page);
        }

        // 2. Queue Monitor (ตัวอย่าง)
        const queueText = await page.locator('text=/ตำแหน่ง|queue|คิว/i').first().textContent().catch(() => '');
        if (queueText) log(`📍 คิว: ${queueText.trim()}`);

        // 3. Auto เลือกโซน
        const zoneBtn = page.locator(`text=/${TARGET_ZONE}/i`).first();
        if (await zoneBtn.isVisible({ timeout: 800 })) {
          await zoneBtn.click({ delay: 120 });
          log(`✅ เลือกโซน ${TARGET_ZONE}`);
        }

        // 4. กดซื้อ
        const buyBtn = page.locator('button:has-text("ซื้อเลย"), button:has-text("Buy"), button:has-text("Confirm"), button:has-text("จอง")').first();
        if (await buyBtn.isVisible({ timeout: 800 })) {
          log('🎉 พบบัตร! กำลังกดซื้อ...', 'SUCCESS');
          playAlert();
          sendNotification('Ticket Found!', `บอทเจอบัตรโซน ${TARGET_ZONE}`);
          await buyBtn.click({ delay: 180 });
          await page.waitForTimeout(700);
          await buyBtn.click();
          clearInterval(interval);
        }
      } catch (e) {}
    }, 680 + Math.random() * 420);
  }
}

runBot();
