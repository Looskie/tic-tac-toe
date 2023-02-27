import { APIResponse, GameState } from "../types";

export class Api {
  public static user_id =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id")
      : "lol xddd";

  static async createGame(): Promise<
    APIResponse<{ id: string; game: GameState }>
  > {
    const game = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: this.user_id }),
    }).then((res) => res.json());

    return game;
  }

  static async joinGame(
    gameID: string
  ): Promise<APIResponse<GameState & { id: string }>> {
    return await fetch(`/api/join/${gameID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: this.user_id }),
    })
      .then((res) => res.json())
      .catch((err) => err);
  }

  static async move(
    gameID: string,
    x: number,
    y: number
  ): Promise<APIResponse> {
    const game = await fetch(`/api/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: this.user_id,
        game_id: gameID,
        move: [x, y],
      }),
    }).then((res) => res.json());

    return game;
  }
}
