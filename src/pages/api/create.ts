import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import { hop } from "../../utils/Hop";
import { ChannelType } from "@onehop/js";
import { APIResponse, GameState } from "../../types";
import { z } from "zod";

const bodySchema = z.object({
  user_id: z.string().min(5),
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

  const gameID = nanoid(5);
  const userID = body.data.user_id;

  const gameChannel = await hop.channels
    .create(ChannelType.UNPROTECTED, gameID, {
      state: {
        players: [userID],
        board: new Array(3).fill(new Array(3).fill(undefined)),
        turn: "",
        winner: null,
        created_at: new Date().toISOString(),
      },
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        error: "Failed to create game",
      });

      return null;
    });

  if (!gameChannel) return;

  res.json({
    success: true,
    data: {
      id: gameChannel.id,
      game: gameChannel.state as unknown as GameState,
    },
  });
}
