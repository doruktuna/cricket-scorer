export type PlayerId = number;

export type CricketNumber = 15 | 16 | 17 | 18 | 19 | 20 | 25;

export enum ShotActionType {
  SHOT,
  END_TURN,
}

export interface Player {
  id: PlayerId;
  name: string;
  score: number;
  hits: Record<CricketNumber, number>;
}

export interface ShotAction {
  type: ShotActionType;
  player: Player;
  shotsLeftBeforeShot: number;
  cricketNumber?: CricketNumber;
  amount?: number;
}

export interface GameState {
  players: Player[];
  currentPlayerInd: number;
  currentPlayerShotsLeft: number;
  roundNo: number;
  maxRounds: number;
  isStarted: boolean;
  isFinished: boolean;
  shotActions: ShotAction[];
  shotActionsInd: number;
}
