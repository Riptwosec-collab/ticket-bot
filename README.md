# Ticket Dashboard

Local Next.js dashboard for status checks and live log viewing.

## What Works

- Dashboard page at `/`
- Live log viewer at `/logs`
- Basic status, start, and stop API routes
- Safe handling when `logs/bot.log` does not exist yet

## Disabled

Automated CAPTCHA solving, stealth browsing, and automatic ticket purchasing are disabled in this cleaned-up build.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Logs

The log stream reads from:

```text
logs/bot.log
```

Create that file or let another local process write to it if you want lines to appear in the Live Logs page.
