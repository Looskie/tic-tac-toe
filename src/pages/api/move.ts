// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import { hop } from "../../utils/Hop";
import { ChannelType } from "@onehop/js";
import { MESSAGE_NAMES } from "../../utils/Commons";
import { GameState } from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean }>
) {
  if (req.method !== "POST") return res.status(405);

  const gameID = req.body.gameID;
  const userID = req.body.userID;
  const [row, column] = req.body.move;

  const gameChannel = await hop.channels.get(gameID);
  if (!gameChannel)
    return res.status(404).json({
      success: false,
    });

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

  gameChannel.publishMessage(MESSAGE_NAMES.UPDATE_GAME, {
    board: newBoard,
    turn: newTurn,
  });

  const xUser = gameChannelState.players[0];
  const oUser = gameChannelState.players[1];

  // check if game is over
  const winner = checkWinner(newBoard);

  if (winner !== null) {
    hop.channels.delete(gameID);
    gameChannel.publishMessage(MESSAGE_NAMES.GAME_OVER, {
      winner: winner === "X" ? xUser : oUser,
    });
  }

  res.status(204);
}

function transpose(matrix: string[][]) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

function checkWinner(board: string[][]): string | null {
  for (const row of board) {
    if (row.slice(1).every((x) => x === row[0])) {
      return row[0];
    }
  }

  const flipped = transpose(board);

  for (const column of flipped) {
    if (column.slice(1).every((x) => x === column[0])) {
      return column[0];
    }
  }

  const diagOne = board[0][0] === board[1][1] && board[1][1] === board[2][2];
  const diagTwo = board[2][0] === board[1][1] && board[1][1] === board[0][2];

  return diagOne ? board[0][0] : diagTwo ? board[2][0] : null;
}
