import { useChannelMessage } from "@onehop/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { styled } from "../../stitches.config";
import { FetchCapybaraResponse, GameState } from "../../types";
import { Api } from "../../utils/Api";
import { MESSAGE_NAMES } from "../../utils/Commons";
import { checkWinner } from "../../utils/Helpers";

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  gap: 10,

  "> img": {
    maxWidth: 400,
    maxHeight: 300,
    borderRadius: 5,
    border: "2px solid $bg-tertiary",
  },

  "> p": {
    maxWidth: "30ch",
    userSelect: "none",
  },

  span: {
    fontWeight: "bold",
    color: "$text-primary",
    userSelect: "text",
  },
});

const BtnWrapper = styled("div", {
  display: "flex",
  gap: 10,
  alignSelf: "center",
});

const Grid = styled("button", {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(3, 1fr)",
  gap: 10,

  "> button": {
    border: "1px solid $bg-tertiary",
    borderRadius: 5,
    padding: 10,
    fontSize: 50,
    width: 100,
    height: 100,
    cursor: "pointer",
    backgroundColor: "$bg-secondary",

    "&:hover": {
      backgroundColor: "$bg-tertiary",
    },
  },
});

export default function Game() {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<GameState | null>(null);
  const [capybara, setCapybara] = useState<FetchCapybaraResponse | null>(null);

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
    turn: string;
  }>(gameID as string, MESSAGE_NAMES.PLAYER_JOIN, (data) => {
    if (!game) return;

    setGame({
      ...game,
      players: data.players,
      turn: data.turn,
    });
  });

  useChannelMessage<{
    winner: string;
  }>(gameID as string, MESSAGE_NAMES.GAME_OVER, (data) => {
    if (!game) return;

    setGame({
      ...game,
      winner: data.winner,
    });
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!gameID) return;

    setLoading(true);
    Api.joinGame(gameID as string)
      .then((game) => {
        if ("success" in game) {
          router.push("/");
          return;
        }

        setGame(game);
      })
      .finally(() => setLoading(false));
  }, [gameID]);

  const fetchCapybara = async () => {
    const capy = (await fetch("https://api.capy.lol/v1/capybara", {
      headers: {
        Accept: "application/json",
      },
    }).then((res) => res.json())) as { data: FetchCapybaraResponse };

    setCapybara(capy.data);
  };

  if (!game || loading) return <Container>loading...</Container>;

  if (game.winner)
    return (
      <Container>
        <h1>game over!</h1>
        {game.winner === "draw" ? (
          <p>its a draw!</p>
        ) : (
          <p>you {game.winner === Api.user_id ? "won!" : "lost :("}</p>
        )}
        <img
          src={
            game.winner === Api.user_id
              ? "https://api.capy.lol/v1/capybara/149"
              : "https://preview.redd.it/lzinlzzzgr481.jpg?width=640&crop=smart&auto=webp&s=e6aba10ce513791107e89e8106255b8c6903f86e"
          }
        />
        <BtnWrapper>
          <Button onClick={() => router.push("/")} secondary>
            back to lobby
          </Button>
        </BtnWrapper>
      </Container>
    );

  // game creator is always x
  const playersIndicator = game.players[0] === Api.user_id ? "X" : "O";

  return game.players.length < 2 ? (
    <>
      <Container>
        <h1>waiting for players...</h1>
        <p>
          Your code is <span>{gameID}</span> in the meantime, want to view a
          capybara?
        </p>
        <BtnWrapper>
          <Button onClick={fetchCapybara} secondary>
            capy!
          </Button>
          {/* fetch capybara anyways lol!!! */}
          <Button onClick={fetchCapybara} secondary>
            no :(
          </Button>
        </BtnWrapper>
        {capybara ? (
          <Image
            alt={capybara.index + "Capybara"}
            src={capybara.url}
            width={capybara.width}
            height={capybara.height}
          />
        ) : null}
      </Container>
    </>
  ) : (
    <Container>
      <h1>
        {game.turn === Api.user_id ? "your " : "waiting for player's "}
        turn!
      </h1>
      <Grid>
        {game.board.map((value, rowIndex) => {
          return value.map((value, columnIndex) => {
            return (
              <button
                key={`${rowIndex}-${columnIndex}`}
                onClick={() => {
                  if (game.turn !== Api.user_id) return;

                  const newBoard = game.board;
                  if (newBoard[rowIndex][columnIndex]) return;

                  Api.move(gameID as string, rowIndex, columnIndex);

                  newBoard[rowIndex][columnIndex] = playersIndicator;

                  const winner = checkWinner(newBoard);
                  // set the new board state from row column
                  setGame({
                    ...game,
                    board: newBoard,
                    turn: game.players.find((p) => p !== Api.user_id) ?? "",
                    winner:
                      winner !== null
                        ? /* if there is a winner and the winner is x player 1 wins otherwise it is player 2 */
                          winner === "draw"
                          ? "draw"
                          : winner === "X"
                          ? game.players[0]
                          : game.players[1]
                        : null,
                  });
                }}
              >
                {value ?? ""}
              </button>
            );
          });
        })}
      </Grid>
      <span>Your are {playersIndicator}</span>
    </Container>
  );
}
