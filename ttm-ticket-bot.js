// ttm-ticket-bot.js
const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
chromium.use(StealthPlugin());

require('dotenv').config();
const { solveReCaptcha } = require('./captcha-solver');

const proxies = process.env.PROXIES.split(',').filter(Boolean);
const accounts = JSON.parse(process.env.ACCOUNTS || '[]');
const EVENT_URL = process.env.EVENT_URL;
const TARGET_ZONE = process.env.TARGET_ZONE || "VIP";
const PLATFORM = process.env.PLATFORM || "TTM";

let proxyIndex = 0;

async function humanDelay(ms) {
  return new Promise(r => setTimeout(r, ms + Math.random() * 400));
}

async function getBrowser(account) {
  const proxy = proxies[proxyIndex % proxies.length];
  proxyIndex++;

  const browser = await chromium.launch({
    headless: false,
    args: [
      `--proxy-server=${proxy}`,
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox'
    ]
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'th-TH',
  });

  const page = await context.newPage();

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  // Login
  console.log(`🔑 Login ด้วย ${account.email}`);
  await page.goto(PLATFORM === "TTM" ? "https://www.thaiticketmajor.com/login" : "https://www.ticketmelon.com/login", { waitUntil: 'networkidle' });
  
  await page.fill('input[type="email"], input[name="email"]', account.email);
  await page.fill('input[type="password"]', account.pass);
  await page.click('button[type="submit"], button:contains("เข้าสู่ระบบ")');
  await humanDelay(5000);

  return { browser, page, context };
}

async function runBot() {
  if (!EVENT_URL) {
    console.error("❌ กรุณาตั้ง EVENT_URL ใน .env");
    return;
  }

  for (const account of accounts) {
    const { page } = await getBrowser(account);
    console.log(`🚀 เริ่มบอท ${account.email} | Zone: ${TARGET_ZONE}`);

    await page.goto(EVENT_URL, { waitUntil: 'networkidle' });

    setInterval(async () => {
      try {
        // Solve CAPTCHA
        if (await page.locator('.g-recaptcha, iframe[src*="recaptcha"]').count() > 0) {
          await solveReCaptcha(page);
        }

        // Auto เลือกโซน
        const zoneSelector = `text=/${TARGET_ZONE}/i`;
        const zoneBtn = page.locator(zoneSelector).first();
        if (await zoneBtn.isVisible({ timeout: 1000 })) {
          await zoneBtn.click({ delay: 150 });
          console.log(`✅ เลือกโซน ${TARGET_ZONE}`);
        }

        // กดปุ่มซื้อ
        const buyBtn = page.locator('button:has-text("ซื้อเลย"), button:has-text("Buy"), button:has-text("Confirm"), button:has-text("จอง"), button:has-text("Book")').first();
        if (await buyBtn.isVisible({ timeout: 1000 })) {
          console.log("🎉 พบบัตร! กำลังกดซื้อ...");
          await buyBtn.click({ delay: 200 });
          await humanDelay(800);
          await buyBtn.click();
        }
      } catch (e) {
        // Silent
      }
    }, 650 + Math.random() * 450);
  }
}

runBot().catch(console.error);

console.log("🎟️ Bot เริ่มทำงานแล้ว - อย่าปิด Terminal");
