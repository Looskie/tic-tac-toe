import { Timestamp } from "@onehop/js";
import { ZodError } from "zod";

export interface GameState {
  players: string[];
  board: string[][];
  turn: string;
  winner: string | null;
  created_at: Timestamp;

  // this piece of state will help us determine if both players want a rematch, this is only really used for sync issues (as when both users press "rematch", it will cause a ui state issue), we can't have it in an array as well, otherwise it would get overwritten
  xWantsRematch?: boolean;
  oWantsRematch?: boolean;

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
