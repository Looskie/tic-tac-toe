export interface GameState {
  players: string[];
  board: string[][];
  turn: string;
  winner: string | null;
}

export interface FetchCapybaraResponse {
  url: string;
  index: number;
  width: number;
  height: number;
}
