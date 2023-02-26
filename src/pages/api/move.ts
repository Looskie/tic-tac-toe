// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GameState } from "../../types";
import { MESSAGE_NAMES } from "../../utils/Commons";
import { checkWinner } from "../../utils/Helpers";
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

  res.status(204);

  if (winner !== null) {
    await gameChannel.publishMessage(MESSAGE_NAMES.GAME_OVER, {
      winner: winner === "draw" ? "draw" : winner === "X" ? xUser : oUser,
    });

    hop.channels.delete(gameID);
  }
}
