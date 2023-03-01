import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { APIResponse, GameState } from "../../types";
import { MESSAGE_NAMES } from "../../utils/Commons";
import { checkWinner } from "../../utils/Helpers";
import { hop } from "../../utils/Hop";

const bodySchema = z.object({
  game_id: z.string().min(5),
  user_id: z.string().min(15),
  move: z.array(z.number()).nonempty().length(2),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  if (req.method !== "POST")
    return res
      .status(405)
      .json({ success: false, error: "Must be a post request" });

  const body = bodySchema.safeParse(req.body);
  if (!body.success)
    return res.status(400).json({ success: false, error: body.error.message });

  const gameID = body.data.game_id;
  const userID = body.data.user_id;
  const [row, column] = body.data.move;

  const gameChannel = await hop.channels.get(gameID).catch(() => {
    res.status(404).json({
      success: false,
      error: "Game not found",
    });

    return null;
  });

  if (!gameChannel) return;

  const gameChannelState = gameChannel.state as unknown as GameState;
  if (!gameChannelState.players.includes(userID))
    return res.status(400).json({
      success: false,
      error: "User not in game",
    });

  if (gameChannelState.turn !== userID)
    return res.status(400).json({
      success: false,
      error: "Not your turn",
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
    const score = gameChannelState.score ?? [0, 0];

    if (winner === "X") {
      score[0] += 1;
    } else if (winner === "O") {
      score[1] += 1;
    }

    await gameChannel.publishMessage(MESSAGE_NAMES.GAME_OVER, {
      winner: winner === "draw" ? "draw" : winner === "X" ? xUser : oUser,
    });

    await gameChannel.setState({
      ...gameChannelState,
      score: score,
      xWantsRematch: false,
      oWantsRematch: false,
    });
  }

  res.json({
    success: true,
    data: undefined,
  });
}
