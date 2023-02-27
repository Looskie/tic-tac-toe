import { nanoid } from "nanoid";
import { APIResponse, GameState } from "../types";

export class Api {
  public static user_id =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id")
      : "lol xddd";

  static getUserID() {
    if (!Api.user_id || Api.user_id === "") {
      const id = nanoid(15);
      this.user_id = id;
      localStorage.setItem("user_id", id);

      return id;
    } else {
      return Api.user_id;
    }
  }

  static async createGame(): Promise<
    APIResponse<{ id: string; game: GameState }>
  > {
    const userId = this.getUserID();
    const game = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    }).then((res) => res.json());

    return game;
  }

  static async joinGame(
    gameID: string
  ): Promise<APIResponse<GameState & { id: string }>> {
    const userId = this.getUserID();

    return await fetch(`/api/join/${gameID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((res) => res.json())
      .catch((err) => err);
  }

  static async move(
    gameID: string,
    x: number,
    y: number
  ): Promise<APIResponse> {
    const userId = this.getUserID();

    const game = await fetch(`/api/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        game_id: gameID,
        move: [x, y],
      }),
    }).then((res) => res.json());

    return game;
  }
}
