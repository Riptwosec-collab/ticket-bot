import { NextResponse } from 'next/server';
import { botState } from '../bot-state';

export async function GET() {
  return NextResponse.json({
    isRunning: botState.isRunning,
    message: botState.message,
    bots: botState.isRunning
      ? [
          {
            email: 'local-dashboard',
            proxy: 'none',
            status: 'running',
            zone: 'manual',
            lastAction: botState.message,
            startedAt: botState.startedAt,
          },
        ]
      : [],
  });
}
