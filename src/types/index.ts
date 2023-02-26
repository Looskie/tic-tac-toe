import { Timestamp } from "@onehop/js";

export interface GameState {
  players: string[];
  board: string[][];
  turn: string;
  winner: string | null;
  created_at: Timestamp;
}

export interface FetchCapybaraResponse {
  url: string;
  index: number;
  width: number;
  height: number;
}
