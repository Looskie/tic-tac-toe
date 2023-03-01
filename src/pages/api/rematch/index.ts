import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { APIResponse, GameState } from "../../../types";
import { MESSAGE_NAMES } from "../../../utils/Commons";
import { hop } from "../../../utils/Hop";

const bodySchema = z.object({
  user_id: z.string().min(15),
  previous_match: z.string().min(5),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    APIResponse<{
      id: string;
      game: GameState;
    }>
  >
) {
  if (req.method !== "POST")
    return res
      .status(405)
      .json({ success: false, error: "Must be a post request" });

  const body = bodySchema.safeParse(req.body);
  if (!body.success)
    return res.status(400).json({ success: false, error: body.error.message });

  const previousMatch = body.data.previous_match;

  const gameChannel = await hop.channels.get(previousMatch).catch(() => {
    res.status(404).json({
      success: false,
      error: "Game not found",
    });

    return null;
  });

  if (!gameChannel) return;
  const gameChannelState = gameChannel.state as unknown as GameState;

  const newChannelState = {
    ...gameChannel.state,
    board: new Array(3).fill(new Array(3).fill(undefined)),
    turn:
      Math.random() < 0.5
        ? gameChannelState.players[0]
        : gameChannelState.players[1],
    winner: null,
    created_at: new Date().toISOString(),
  };

  // reset board
  await gameChannel.setState(newChannelState);

  await hop.channels.publishMessage(previousMatch, MESSAGE_NAMES.REMATCH, {
    id: gameChannel.id,
    game: newChannelState,
  });

  res.json({
    success: true,
    data: {
      id: gameChannel.id,
      game: newChannelState as GameState,
    },
  });
}
