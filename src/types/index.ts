import { Timestamp } from "@onehop/js";
import { ZodError } from "zod";

export interface GameState {
  players: string[];
  board: string[][];
  turn: string;
  winner: string | null;
  created_at: Timestamp;

  // index 0: first player, index 1: second player
  score?: [number, number];
}

export interface FetchCapybaraResponse {
  url: string;
  index: number;
  width: number;
  height: number;
}

export type APIResponse<T extends any = undefined> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
