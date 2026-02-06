import type { CricketNumber } from "./types/cricket";

export const LOCAL_STORAGE_NAME = "cricket-doruk-v2";

// The ordering will be used in UI
export const CRICKET_NUMBERS: CricketNumber[] = [20, 19, 18, 17, 16, 15, 25];
export const EMPTY_HITS: Record<CricketNumber, number> = {
  20: 0,
  19: 0,
  18: 0,
  17: 0,
  16: 0,
  15: 0,
  25: 0,
};
