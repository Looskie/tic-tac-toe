import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { APIResponse, GameState } from "../../../types";
import { MESSAGE_NAMES } from "../../../utils/Commons";
import { hop } from "../../../utils/Hop";

const bodySchema = z.object({
  user_id: z.string().min(15),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    APIResponse<
      {
        id: string;
      } & GameState
    >
  >
) {
  if (req.method !== "POST")
    return res.status(405).json({
      success: false,
      error: "Must be a post request",
    });

  const body = bodySchema.safeParse(req.body);
  if (!body.success)
    return res.status(400).json({
      success: false,
      error: body.error.message,
    });

  const gameID = req.query.id as string;
  const userID = body.data.user_id;

  const gameChannel = await hop.channels.get(gameID).catch(() => {
    res.status(404).json({
      success: false,
      error: "Game not found",
    });

    return null;
  });
  if (!gameChannel) return;

  const gameChannelState = gameChannel.state as unknown as GameState;
  if (
    gameChannelState.players.length >= 2 &&
    !gameChannelState.players.includes(userID)
  )
    return res.status(400).json({
      success: false,
      error: "Game is full",
    });

  // put user in game
  const newPlayers = [...new Set([...gameChannelState.players, userID])];

  const turn =
    newPlayers.length === 2
      ? gameChannelState.turn === ""
        ? Math.random() < 0.5
          ? newPlayers[0]
          : newPlayers[1]
        : gameChannelState.turn
      : "";

  if (!gameChannelState.players.includes(userID)) {
    await hop.channels.setState(gameID, {
      ...gameChannel.state,
      players: newPlayers,
      turn,
    });
  }

  // player join
  await hop.channels.publishMessage(gameID, MESSAGE_NAMES.PLAYER_JOIN, {
    userId: userID,
    players: newPlayers,
    turn,
  });

  return res.status(200).json({
    success: true,
    data: {
      id: gameChannel.id,
      ...gameChannelState,
      turn,
    },
  });
}
