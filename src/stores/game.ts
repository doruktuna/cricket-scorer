import { defineStore } from "pinia";
import { toRaw } from "vue";
import { EMPTY_HITS, LOCAL_STORAGE_NAME } from "@/constants";
import { shotStr } from "@/Helpers";
import {
  ShotActionType,
  type CricketNumber,
  type GameState,
  type Player,
  type ShotAction,
} from "@/types/cricket";

const MAX_ROUNDS = 25;
const MAX_HISTORY = 50;

/* -------------------- HELPERS -------------------- */
function initialGameState(): GameState {
  return {
    players: [
      { id: 0, name: "Player 1", score: 0, hits: { ...EMPTY_HITS } },
      { id: 1, name: "Player 2", score: 0, hits: { ...EMPTY_HITS } },
    ],
    currentPlayerInd: 0,
    currentPlayerShotsLeft: 3,
    roundNo: 1,
    maxRounds: MAX_ROUNDS,
    isStarted: false,
    isFinished: false,
    lastAction: null,
  };
}

function cloneGame(state: GameState): GameState {
  return structuredClone(toRaw(state));
}

function actionStr(
  action: ShotAction | null,
  player: Player | undefined,
): string {
  if (!action || !player) {
    return "---";
  }

  const name = player?.name ?? "Unknown";

  return action.type == ShotActionType.END_TURN
    ? `${name}: ET`
    : `${name}: ${shotStr(action.cricketNumber, action.amount)}`;
}

export const useGameStore = defineStore("game", {
  state: () => ({
    past: [] as GameState[],
    present: initialGameState(),
    future: [] as GameState[],
  }),
  getters: {
    game: (s) => s.present,

    players: (s) => s.present.players,

    currentPlayer: (s) => s.present.players[s.present.currentPlayerInd]!,

    isUndoAvailable: (s) => s.past.length > 0,
    isRedoAvailable: (s) => s.future.length > 0,

    lastAction: (s) => s.present.lastAction,
    nextAction: (s) => (s.future.length == 0 ? null : s.future[0]!.lastAction),

    lastActionString(): string {
      const prevAction = this.lastAction;
      const player = this.players.find((p) => p.id === prevAction?.playerId);
      return actionStr(prevAction, player);
    },

    nextActionString(): string {
      const nextAction = this.nextAction;
      const player = this.future[0]?.players.find(
        (p) => p.id === nextAction?.playerId,
      );
      return actionStr(nextAction, player);
    },

    winners(): Player[] {
      const minScore = Math.min(...this.present.players.map((p) => p.score));
      return this.present.players.filter((p) => p.score === minScore);
    },

    isAllClosedNumber: (s) => {
      return (cn: CricketNumber) =>
        s.present.players.every((p) => p.hits[cn] >= 3);
    },
  },
  actions: {
    /* ---------- CORE COMMIT LOGIC  ---------- */
    /* ---------- (allows for undo/redo)  ---------- */
    commit(mutator: (state: GameState) => void, action: ShotAction | null) {
      this.past.push(cloneGame(this.present));
      if (this.past.length > MAX_HISTORY) {
        this.past.shift();
      }

      this.future = [];
      mutator(this.present);
      this.present.lastAction = action;

      this.persist();
    },

    persist() {
      localStorage.setItem(
        LOCAL_STORAGE_NAME,
        JSON.stringify({
          present: this.present,
          past: this.past,
        }),
      );
    },

    hydrate() {
      const raw = localStorage.getItem(LOCAL_STORAGE_NAME);
      if (!raw) return;

      const saved = JSON.parse(raw);
      this.present = saved.present ?? initialGameState();
      this.past = saved.past ?? [];
      this.future = [];
    },

    /* ---------- undo / redo ---------- */
    undo() {
      if (!this.isUndoAvailable) return;

      this.future.unshift(cloneGame(this.present));
      this.present = this.past.pop()!;
      this.persist();
    },

    redo() {
      if (!this.isRedoAvailable) return;

      this.past.push(cloneGame(this.present));
      this.present = this.future.shift()!;
      this.persist();
    },

    /* ---------- game lifecycle ---------- */
    startGame() {
      this.resetGameState();
      this.present.isStarted = true;
      this.persist();
    },

    resetGameState() {
      this.players.forEach((p) => {
        p.score = 0;
        p.hits = { ...EMPTY_HITS };
      });
      this.present.currentPlayerInd = 0;
      this.present.currentPlayerShotsLeft = 3;
      this.present.roundNo = 1;
      this.present.maxRounds = 25;
      this.present.isStarted = false;
      this.present.isFinished = false;
      this.past = [];
      this.future = [];
      this.persist();
    },

    restartGame() {
      this.resetGameState();
      this.present.isStarted = true;
      this.persist();
    },

    addPlayer() {
      const numPlayers = this.players.length;
      this.players.push({
        id: numPlayers,
        name: `Player ${numPlayers + 1}`,
        score: 0,
        hits: { ...EMPTY_HITS },
      });
      this.persist();
    },

    removePlayerWithId(id: number) {
      this.present.players = this.players.filter((p) => p.id != id);
      this.updateIds();
      this.persist();
    },

    swapWithPreviousPlayer(id: number) {
      const prevId = id > 0 ? id - 1 : this.players.length - 1;
      if (!this.players[id] || !this.players[prevId]) {
        return;
      }

      const name = this.players[id]?.name ?? "";
      this.players[id].name = this.players[prevId].name;
      this.players[prevId].name = name;
      this.updateIds();
      this.persist();
    },

    swapWithNextPlayer(id: number) {
      const nextId = id < this.players.length - 1 ? id + 1 : 0;
      if (!this.players[id] || !this.players[nextId]) {
        return;
      }

      const name = this.players[id]?.name ?? "";
      this.players[id].name = this.players[nextId].name;
      this.players[nextId].name = name;
      this.updateIds();
      this.persist();
    },

    /* ---------- gameplay ---------- */
    shotMade(cricketNumber: CricketNumber, amount = 1) {
      this.commit(
        (g) => {
          const player = g.players[g.currentPlayerInd]!;

          player.hits[cricketNumber] += amount;
          this.updateScores(
            g,
            cricketNumber,
            player.hits[cricketNumber],
            amount,
          );

          g.currentPlayerShotsLeft--;

          if (g.currentPlayerShotsLeft <= 0) {
            this.setTurnToNextPlayer(g);
          }

          if (this.isAllClosed(player) && this.winners.length === 1) {
            g.isFinished = true;
          }
        },
        {
          type: ShotActionType.SHOT,
          playerId: this.currentPlayer.id,
          cricketNumber,
          amount,
        },
      );
    },

    endCurrentPlayerTurn() {
      this.commit(
        (g) => {
          this.setTurnToNextPlayer(g);
        },
        {
          type: ShotActionType.END_TURN,
          playerId: this.currentPlayer.id,
        },
      );
    },

    /* ---------- internal game logic ---------- */
    updateScores(
      g: GameState,
      cricketNumber: CricketNumber,
      hitsAfterShot: number,
      amount: number,
    ) {
      if (hitsAfterShot <= 3) return;

      const excessHits = Math.min(amount, hitsAfterShot - 3);
      const scoreToAdd = excessHits * cricketNumber;

      g.players
        .filter((p) => p.hits[cricketNumber] < 3)
        .forEach((p) => (p.score += scoreToAdd));
    },

    setTurnToNextPlayer(g: GameState) {
      if (g.currentPlayerInd === g.players.length - 1) {
        g.currentPlayerInd = 0;
        if (g.roundNo < g.maxRounds) {
          g.roundNo++;
        } else {
          g.isFinished = true;
        }
      } else {
        g.currentPlayerInd++;
      }

      g.currentPlayerShotsLeft = 3;
    },

    isAllClosed(player: Player): boolean {
      return Object.values(player.hits).every((v) => v >= 3);
    },

    updateIds() {
      this.players.forEach((p, ind) => (p.id = ind));
    },
  },
});
