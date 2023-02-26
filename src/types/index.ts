export interface GameState {
  players: string[];
  board: string[][];
  turn: string;
  winner: string | null;
}
