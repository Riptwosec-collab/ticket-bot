import { NextResponse } from 'next/server';
import { botState } from '../bot-state';

export async function POST() {
  botState.isRunning = false;
  botState.startedAt = null;
  botState.message =
    'Dashboard is running. Automated CAPTCHA solving and ticket purchasing are disabled in this build.';

  return NextResponse.json({
    success: false,
    disabled: true,
    message: botState.message,
  });
}
