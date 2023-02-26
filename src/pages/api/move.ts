// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GameState } from "../../types";
import { MESSAGE_NAMES } from "../../utils/Commons";
import { hop } from "../../utils/Hop";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean }>
) {
  if (req.method !== "POST") return res.status(405);

  const gameID = req.body.gameID;
  const userID = req.body.userID;
  const [row, column] = req.body.move;

  const gameChannel = await hop.channels.get(gameID).catch((err) => {
    res.status(404).json({
      success: false,
    });

    return null;
  });
  if (!gameChannel) return;

  const gameChannelState = gameChannel.state as unknown as GameState;
  if (!gameChannelState.players.includes(userID))
    return res.status(400).json({
      success: false,
    });

  if (gameChannelState.turn !== userID)
    return res.status(400).json({
      success: false,
    });

  const newBoard = [...gameChannelState.board];

  newBoard[row][column] =
    gameChannelState.players.findIndex((id) => id === userID) === 0 ? "X" : "O";

  const newTurn = gameChannelState.players.find(
    (id) => id !== userID
  ) as string;

  await gameChannel.setState({
    ...gameChannelState,
    board: newBoard,
    turn: newTurn,
  });

  await gameChannel.publishMessage(MESSAGE_NAMES.UPDATE_GAME, {
    board: newBoard,
    turn: newTurn,
  });

  const xUser = gameChannelState.players[0];
  const oUser = gameChannelState.players[1];

  // check if game is over
  const winner = checkWinner(newBoard);

  if (winner !== null) {
    await gameChannel.publishMessage(MESSAGE_NAMES.GAME_OVER, {
      winner: winner === "X" ? xUser : oUser,
    });

    hop.channels.delete(gameID);
  }

  res.status(204);
}

const checkWinner = (board: string[][]): string | null => {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2] &&
      board[i][0] !== null
    ) {
      return board[i][0];
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] === board[1][j] &&
      board[1][j] === board[2][j] &&
      board[0][j] !== null
    ) {
      return board[0][j];
    }
  }

  // Check diagonals
  if (
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[0][0] !== null
  ) {
    return board[0][0];
  }

  if (
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0] &&
    board[0][2] !== null
  ) {
    return board[0][2];
  }

  // If there is no winner, return null
  return null;
};
