import { Timestamp } from "@onehop/js";
import { ZodError } from "zod";

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

export type APIResponse<T extends any = undefined> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
