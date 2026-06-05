// app/api/logs/stream/route.ts
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOG_PATH = path.join(process.cwd(), '../ttm-ticket-bot-v2/logs/bot.log');

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      if (fs.existsSync(LOG_PATH)) {
        const content = fs.readFileSync(LOG_PATH, 'utf-8');
        content.split('\n').forEach(line => {
          if (line.trim()) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ line })}\n\n`));
        });
      }

      const watcher = fs.watch(LOG_PATH, () => {
        if (fs.existsSync(LOG_PATH)) {
          const content = fs.readFileSync(LOG_PATH, 'utf-8');
          const lastLine = content.trim().split('\n').pop();
          if (lastLine) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ line: lastLine })}\n\n`));
          }
        }
      });

      req.signal.onabort = () => watcher.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
