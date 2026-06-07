import { NextResponse } from 'next/server';
import { botState } from '../bot-state';

export async function POST() {
  botState.isRunning = false;
  botState.startedAt = null;
  botState.message = 'Stopped';

  return NextResponse.json({
    success: true,
    message: botState.message,
  });
}
