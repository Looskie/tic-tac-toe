import { GameState } from "../types";

export class Api {
  public static user_id =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id")
      : "lol xddd";

  static async createGame() {
    const game = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: this.user_id }),
    }).then((res) => res.json());

    return game;
  }

  static async joinGame(
    gameID: string
  ): Promise<GameState | { success: false }> {
    return await fetch(`/api/join/${gameID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: this.user_id }),
    })
      .then((res) => res.json())
      .catch((err) => err);
  }

  static async move(gameID: string, x: number, y: number) {
    const game = await fetch(`/api/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: this.user_id, gameID, move: [x, y] }),
    }).then((res) => res.json());

    return game;
  }
}
