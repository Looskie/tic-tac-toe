import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { styled } from "../stitches.config";
import { Api } from "../utils/Api";

const GameTypeWrapper = styled("div", {
  display: "flex",
  gap: 10,
  justifyContent: "flex-start",
  alignItems: "flex-start",
});

const GameType = styled("button", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  cursor: "pointer",
  padding: "15px 20px",
  transition: "transform 0.2s ease-in-out",
  willChange: "transform",

  "> div": {
    display: "flex",
    gap: 10,
  },

  "&:hover": {
    transform: "scale(1.05)",
  },

  variants: {
    noScale: {
      true: {
        transform: "none!important",
      },
    },
  },
});

export default function Home() {
  const [showJoinGameUI, setShowJoinGameUI] = useState(false);
  const [creating, setCreating] = useState(false);
  const [gameIDInput, setGameIDInput] = useState("");

  const router = useRouter();

  const joinGame = () => {
    if (gameIDInput.length !== 5)
      return alert("Game ID must be 5 characters long");

    router.push(`/game/${gameIDInput}`);
  };

  const createGame = async () => {
    if (creating) return;
    setCreating(true);
    const game = await Api.createGame();
    setCreating(false);

    router.push(`/game/${game.id}`);
  };

  return (
    <>
      <h1>capybara Tic-Tac-Toe</h1>
      {!showJoinGameUI ? (
        <GameTypeWrapper>
          <GameType onClick={() => setShowJoinGameUI(true)}>
            <h1>join game</h1>
            <p>if you have a game ID already, you can join it here.</p>
          </GameType>
          <GameType onClick={createGame}>
            <h1>create game</h1>
            <p>create a tic-tac-toe game and play against your friends</p>
          </GameType>
        </GameTypeWrapper>
      ) : (
        <GameType noScale={true}>
          <h1>join game</h1>
          <Input
            value={gameIDInput}
            onChange={({ target: { value } }) => setGameIDInput(value)}
            placeholder="Game ID"
          />
          <div>
            <Button
              onClick={() => {
                setShowJoinGameUI(false);
              }}
              secondary
            >
              back
            </Button>
            <Button onClick={joinGame} secondary>
              join
            </Button>
          </div>
        </GameType>
      )}
    </>
  );
}
