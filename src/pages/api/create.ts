// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import { hop } from "../../utils/Hop";
import { ChannelType } from "@onehop/js";
import { GameState } from "../../types";

interface CreateGameResponse {
  id: string;
  game: GameState;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateGameResponse>
) {
  if (req.method !== "POST") return res.status(405);

  const gameID = nanoid(5);
  const userID = req.body.userID;

  const gameChannel = await hop.channels.create(
    ChannelType.UNPROTECTED,
    gameID,
    {
      state: {
        players: [userID],
        board: new Array(3).fill(new Array(3).fill(undefined)),
        turn: "",
        winner: null,
        created_at: new Date().toISOString(),
      },
    }
  );

  res.json({
    id: gameChannel.id,
    game: gameChannel.state as unknown as GameState,
  });
}
