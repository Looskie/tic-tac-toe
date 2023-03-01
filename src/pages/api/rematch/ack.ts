import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { APIResponse, GameState } from "../../../types";
import { MESSAGE_NAMES } from "../../../utils/Commons";
import { hop } from "../../../utils/Hop";

const bodySchema = z.object({
  user_id: z.string().min(15),
  game_id: z.string().min(5),
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

  const gameId = body.data.game_id;
  const userId = body.data.user_id;

  const gameChannel = await hop.channels.get(gameId).catch(() => {
    res.status(404).json({
      success: false,
      error: "Game not found",
    });

    return null;
  });

  if (!gameChannel) return;
  const gameChannelState = gameChannel.state as unknown as GameState;

  if (!gameChannelState.players.includes(userId)) {
    res.status(400).json({
      success: false,
      error: "You are not part of this rematch",
    });

    return;
  }

  if (!gameChannelState.xWantsRematch && !gameChannelState.oWantsRematch) {
    res.status(400).json({
      success: false,
      error: "This game is not awaiting a rematch",
    });

    return;
  }

  if (gameChannelState.xWantsRematch && gameChannelState.oWantsRematch) {
    await hop.channels.publishMessage(gameId, MESSAGE_NAMES.REMATCH_ACCEPTED, {
      id: gameChannel.id,
      game: gameChannelState,
    });
  }

  res.json({
    success: true,
    data: undefined,
  });
}
