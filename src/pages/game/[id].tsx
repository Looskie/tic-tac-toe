import { useChannelMessage } from "@onehop/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { styled } from "../../stitches.config";
import { GameState } from "../../types";
import { Api } from "../../utils/Api";
import { MESSAGE_NAMES } from "../../utils/Commons";

const Grid = styled("button", {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(3, 1fr)",
  gap: 10,

  "> button": {
    border: "1px solid black",
    borderRadius: 5,
    padding: 10,
    fontSize: 20,
    width: 100,
    height: 100,
    cursor: "pointer",
    backgroundColor: "black",

    "&:hover": {
      backgroundColor: "gray",
      color: "white",
    },
  },
});

export default function Game() {
  const [game, setGame] = useState<GameState | null>(null);
  const [gameOver, setGameOver] = useState<string | null>(null);

  const router = useRouter();
  const gameID = router.query.id;

  useChannelMessage<{ board: NonNullable<typeof game>["board"]; turn: string }>(
    gameID as string,
    MESSAGE_NAMES.UPDATE_GAME,
    (data) => {
      if (!game) return;

      setGame({ ...game, board: data.board, turn: data.turn });
    }
  );

  useChannelMessage<{
    userId: string;
    players: string[];
  }>(gameID as string, MESSAGE_NAMES.PLAYER_JOIN, (data) => {
    if (!game) return;

    setGame({
      ...game,
      players: data.players,
    });
  });

  useChannelMessage<{
    winner: string;
  }>(gameID as string, MESSAGE_NAMES.GAME_OVER, (data) => {
    if (!game) return;

    setGameOver(data.winner.length === 0 ? "draw" : data.winner);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!gameID) return;

    Api.joinGame(gameID as string).then((game) => {
      if ("success" in game) {
        router.push("/");
        return;
      }

      setGame(game);
    });
  }, [gameID]);

  return !game || game?.players?.length < 2 ? (
    <>
      <h1>Waiting for other player...</h1>
      <span>Your game code is {gameID}</span>
    </>
  ) : (
    <>
      {gameOver !== null ? (
        <h1>{gameOver === Api.user_id ? "You won!" : "you lost!"}</h1>
      ) : null}

      {gameOver === null && game.turn === Api.user_id ? (
        <h1>Your turn</h1>
      ) : gameOver === null ? (
        <h1>Waiting for other player...</h1>
      ) : null}
      <Grid>
        {game.board.map((value, rowIndex) => {
          return value.map((value, columnIndex) => {
            return (
              <button
                key={`${rowIndex}-${columnIndex}`}
                onClick={() => {
                  Api.move(gameID as string, rowIndex, columnIndex);
                }}
              >
                {value ?? ""}
              </button>
            );
          });
        })}
      </Grid>
    </>
  );
}
