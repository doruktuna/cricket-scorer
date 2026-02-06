import { EMPTY_HITS, LOCAL_STORAGE_NAME } from "@/constants";
import { shotStr } from "@/Helpers";
import {
  ShotActionType,
  type CricketNumber,
  type GameState,
  type Player,
  type ShotAction,
} from "@/types/cricket";
import { defineStore } from "pinia";

const MAX_ROUNDS = 25;

export const useGameStore = defineStore("game", {
  state: (): GameState => ({
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
    shotActions: [],
    shotActionsInd: -1,
  }),
  getters: {
    currentPlayer: (state) => state.players[state.currentPlayerInd]!,
    isUndoAvailable: (state) => state.shotActionsInd >= 0 && !state.isFinished,
    isRedoAvailable: (state) =>
      state.shotActionsInd < state.shotActions.length - 1 && !state.isFinished,
    lastAction: (state) =>
      state.shotActions.length == 0
        ? null
        : state.shotActions[state.shotActionsInd],
    nextAction: (state) =>
      state.shotActionsInd == state.shotActions.length - 1
        ? null
        : state.shotActions[state.shotActionsInd + 1],
    lastActionString(): string {
      const lastAction = this.lastAction;
      if (lastAction == null) {
        return "---";
      }
      return lastAction.type == ShotActionType.END_TURN
        ? `${lastAction.player.name}: ET`
        : `${lastAction.player.name}: ${shotStr(lastAction.cricketNumber, lastAction.amount)}`;
    },
    nextActionString(): string {
      const nextAction = this.nextAction;
      if (nextAction == null) {
        return "---";
      }
      return nextAction.type == ShotActionType.END_TURN
        ? `${nextAction.player.name}: ET`
        : `${nextAction.player.name}: ${shotStr(nextAction.cricketNumber, nextAction.amount)}`;
    },
    winners(): Player[] {
      let minScore = this.players[0]!.score;
      this.players.forEach((p) => {
        p.score < minScore ? (minScore = p.score) : "";
      });
      return this.players.filter((p) => p.score == minScore);
    },
  },
  actions: {
    hydrate() {
      const saved = localStorage.getItem(LOCAL_STORAGE_NAME);
      if (saved) {
        this.$patch(JSON.parse(saved));
      }
    },
    resetGameState() {
      this.players.forEach((p) => {
        p.score = 0;
        p.hits = { ...EMPTY_HITS };
      });
      this.currentPlayerInd = 0;
      this.currentPlayerShotsLeft = 3;
      this.roundNo = 1;
      this.maxRounds = 25;
      this.isStarted = false;
      this.isFinished = false;
      this.shotActions = [];
      this.shotActionsInd = -1;
    },
    restartGame() {
      this.resetGameState();
      this.isStarted = true;
    },
    addPlayer() {
      const numPlayers = this.$state.players.length;
      this.players.push({
        id: numPlayers,
        name: `Player ${numPlayers + 1}`,
        score: 0,
        hits: { ...EMPTY_HITS },
      });
    },
    removePlayerWithId(id: number) {
      this.players = this.players.filter((p) => p.id != id);
      this.updateIds();
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
    },
    shotMade(
      cricketNumber: CricketNumber,
      amount = 1,
      addShotToActionList = true,
    ) {
      // Update hits, update scores if necessary
      const curPlayer = this.players[this.currentPlayerInd];
      if (!curPlayer) {
        console.error("Error while getting current player");
        return;
      }
      curPlayer.hits[cricketNumber] += amount;
      this.updateScores(cricketNumber, curPlayer.hits[cricketNumber], amount);

      // Update shotActions for undo/redo
      if (addShotToActionList) {
        this.addShotAction({
          type: ShotActionType.SHOT,
          player: this.currentPlayer,
          shotsLeftBeforeShot: this.currentPlayerShotsLeft,
          cricketNumber,
          amount,
        });
      }

      // Update shots left, set the turn for next player if no shots are left
      this.currentPlayerShotsLeft--;
      if (this.currentPlayerShotsLeft <= 0) {
        this.setTurnToNextPlayer();
      }

      // Check for win condition (all closed + min score)
      if (
        this.isAllClosed(this.currentPlayer) &&
        this.winners.includes(this.currentPlayer) &&
        this.winners.length == 1
      ) {
        this.isFinished = true;
      }
    },
    endCurrentPlayerTurn() {
      this.addShotAction({
        player: this.currentPlayer,
        type: ShotActionType.END_TURN,
        shotsLeftBeforeShot: this.currentPlayerShotsLeft,
      });
      this.setTurnToNextPlayer();
    },
    undoAction() {
      if (!this.lastAction) {
        return;
      }

      if (this.lastAction.type == ShotActionType.SHOT) {
        this.undoShotMade(
          this.lastAction.player,
          this.lastAction.shotsLeftBeforeShot,
          this.lastAction.cricketNumber!,
          this.lastAction.amount!,
        );
      }

      if (this.shotActionsInd > 0) {
        // This will take care of both End Turn and cases where a players first shot is Undoed
        if (this.lastAction.player !== this.currentPlayer) {
          this.setTurnToPreviousPlayer();
        }
        this.currentPlayerShotsLeft = this.lastAction.shotsLeftBeforeShot;
        this.shotActionsInd--;
      } else {
        this.currentPlayerInd = 0;
        this.shotActionsInd = -1;
        this.currentPlayerShotsLeft = 3;
      }
    },
    redoAction() {
      if (!this.nextAction) {
        return;
      }
      this.nextAction.type == ShotActionType.END_TURN
        ? this.setTurnToNextPlayer()
        : this.shotMade(
            this.nextAction.cricketNumber!,
            this.nextAction.amount,
            false,
          );

      this.shotActionsInd++;
    },

    // ----------- Internals ---------- //
    /** @internal */
    updateIds() {
      this.players.forEach((p, ind) => (p.id = ind));
    },
    /** @internal */
    updateScores(
      cricketNumber: CricketNumber,
      hitsAfterShot: number,
      amount: number,
    ) {
      if (hitsAfterShot <= 3) {
        return;
      }
      const excessHits = Math.min(amount, hitsAfterShot - 3);
      const scoreToAdd = excessHits * cricketNumber;
      this.players
        .filter((p) => p.hits[cricketNumber] < 3)
        .forEach((p) => (p.score += scoreToAdd));
    },
    undoUpdateScores(
      cricketNumber: CricketNumber,
      hitsAfterShot: number,
      amount: number,
    ) {
      if (hitsAfterShot <= 3) {
        return;
      }
      const excessHits = Math.min(amount, hitsAfterShot - 3);
      const scoreToSubtract = excessHits * cricketNumber;
      this.players
        .filter((p) => p.hits[cricketNumber] < 3)
        .forEach((p) => (p.score -= scoreToSubtract));
    },
    /** @internal */
    setTurnToNextPlayer() {
      if (this.currentPlayerInd == this.players.length - 1) {
        this.currentPlayerInd = 0;
        this.roundNo < MAX_ROUNDS ? this.roundNo++ : (this.isFinished = true);
      } else {
        this.currentPlayerInd++;
      }
      this.currentPlayerShotsLeft = 3;
    },
    /** @internal */
    setTurnToPreviousPlayer() {
      if (this.currentPlayerInd == 0) {
        this.currentPlayerInd = this.players.length - 1;
        this.roundNo--;
      } else {
        this.currentPlayerInd--;
      }
    },
    /** @internal */
    addShotAction(action: ShotAction) {
      if (this.shotActionsInd != this.shotActions.length - 1) {
        this.shotActions.splice(this.shotActionsInd + 1);
      }
      this.shotActions.push(action);
      this.shotActionsInd++;
    },
    /** @internal */
    undoShotMade(
      player: Player,
      shotsLeftBeforeShot: number,
      cricketNumber: CricketNumber,
      amount: number,
    ) {
      // If score is made, undo score
      this.undoUpdateScores(cricketNumber, player.hits[cricketNumber], amount);
      player.hits[cricketNumber] -= amount;

      if (shotsLeftBeforeShot == 3 && this.roundNo != 1) {
        this.setTurnToPreviousPlayer();
      }
    },
    /** @internal */
    isAllClosed(player: Player): boolean {
      return Object.values(player.hits).every((amount) => amount >= 3);
    },
    /** @internal */
    shotStr(
      cricketNumber: CricketNumber | undefined,
      amount: number | undefined,
    ): string {
      if (!cricketNumber || !amount) {
        return "";
      }

      if (cricketNumber == 25 && amount == 1) {
        return "BULL";
      } else if (cricketNumber == 25 && amount == 2) {
        return "BE";
      } else if (amount == 1) {
        return cricketNumber.toString();
      } else if (amount == 2) {
        return `D${cricketNumber}`;
      } else if (amount == 3) {
        return `T${cricketNumber}`;
      }

      // This shouldnt happen
      return `${amount}x${cricketNumber}`;
    },
  },
});
