import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { botState } from '../bot-state';

const statusFile = path.join(process.cwd(), 'status.json');

export async function GET() {
  if (fs.existsSync(statusFile)) {
    try {
      const content = fs.readFileSync(statusFile, 'utf-8').replace(/^\uFEFF/, '');
      const accountStatuses = JSON.parse(content);

      return NextResponse.json({
        isRunning: Object.keys(accountStatuses).length > 0,
        message: 'Loaded account status from status.json',
        bots: accountStatuses,
      });
    } catch {
      return NextResponse.json({
        isRunning: false,
        message: 'Unable to read status.json',
        bots: {},
      });
    }
  }

  return NextResponse.json({
    isRunning: botState.isRunning,
    message: botState.message,
    bots: {},
  });
}
