import type { GameData } from "./types.js";

const games = new Map<string, GameData>();

export function saveGame(gameId: string, gameData: GameData): void {
  games.set(gameId, gameData);
}

export function getGame(gameId: string): GameData | undefined {
  return games.get(gameId);
}

export function deleteGame(gameId: string): void {
  games.delete(gameId);
}
