import { styled } from "../stitches.config";
import { useState } from "react";
import { Api } from "../utils/Api";
import { useRouter } from "next/router";

const Container = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid white",
  padding: "15px 20px",
  borderRadius: "5px",
  gap: 10,
  background: "AntiqueWhite",

  "> div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "black",

    "> input": {
      border: "1px solid black",
      borderRadius: 5,
      padding: 10,
      fontSize: 20,
    },

    button: {
      border: "1px solid black",
      borderRadius: 5,
      padding: 10,
      fontSize: 20,
      cursor: "pointer",
      backgroundColor: "black",
      color: "white",
      marginTop: 10,
      marginRight: 10,
    },

    "> p": {
      color: "grey",
      maxWidth: "30ch",
      textAlign: "center",
    },
  },
});

export default function Home() {
  const [selectedUI, setSelectedUI] = useState<"join" | "create" | null>(null);
  const [gameIDInput, setGameIDInput] = useState("");

  const router = useRouter();

  return (
    <Container>
      {selectedUI === null ? (
        <>
          <div onClick={() => setSelectedUI("join")}>
            <h1>Join Game</h1>
            <p>If you have a game ID already, you can join it here.</p>
          </div>
          <div
            onClick={async () => {
              const game = await Api.createGame();

              router.push(`/game/${game.id}`);
            }}
          >
            <h1>Create Game</h1>
            <p>Create a tic-tac-toe game and play against your friends</p>
          </div>
        </>
      ) : (
        <div>
          <h1>Join Game</h1>
          <input
            value={gameIDInput}
            onChange={({ target: { value } }) => setGameIDInput(value)}
            placeholder="Game ID"
          />
          <div>
            <button
              onClick={() => {
                setSelectedUI(null);
              }}
            >
              Back
            </button>
            <button
              onClick={async () => {
                if (gameIDInput.length !== 5)
                  return alert("Game ID must be 5 characters long");
                router.push(`/game/${gameIDInput}`);
              }}
            >
              Join
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}
