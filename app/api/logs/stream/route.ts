import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOG_PATH = path.join(process.cwd(), 'logs', 'bot.log');

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      let watcher: fs.FSWatcher | null = null;

      const sendLine = (line: string) => {
        if (!closed && line.trim()) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ line })}\n\n`));
        }
      };

      if (fs.existsSync(LOG_PATH)) {
        const content = fs.readFileSync(LOG_PATH, 'utf-8');
        content.split('\n').forEach(sendLine);
      } else {
        sendLine('No log file yet. Logs will appear here after a local process writes to logs/bot.log.');
      }

      if (fs.existsSync(LOG_PATH)) {
        watcher = fs.watch(LOG_PATH, () => {
          if (fs.existsSync(LOG_PATH)) {
            const content = fs.readFileSync(LOG_PATH, 'utf-8');
            const lastLine = content.trim().split('\n').pop();
            if (lastLine) sendLine(lastLine);
          }
        });
      }

      const heartbeat = setInterval(() => {
        if (closed) return;
        controller.enqueue(encoder.encode(': heartbeat\n\n'));
      }, 15000);

      req.signal.onabort = () => {
        closed = true;
        clearInterval(heartbeat);
        if (watcher) {
          watcher.close();
        }
        controller.close();
      };
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
