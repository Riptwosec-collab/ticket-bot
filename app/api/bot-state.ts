export type BotState = {
  isRunning: boolean;
  startedAt: string | null;
  message: string;
};

export const botState: BotState = {
  isRunning: false,
  startedAt: null,
  message: 'Ready',
};
