// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GameState } from "../../../types";
import { MESSAGE_NAMES } from "../../../utils/Commons";
import { hop } from "../../../utils/Hop";

export interface CreateGameResponse extends GameState {
  id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | CreateGameResponse
    | {
        success: false;
      }
  >
) {
  if (req.method !== "POST") return res.status(405);

  const gameID = req.query.id as string;
  const gameChannel = await hop.channels.get(gameID).catch(() => {
    res.status(404).json({
      success: false,
    });

    return null;
  });
  if (!gameChannel) return;

  const gameChannelState = gameChannel.state as unknown as GameState;
  if (
    gameChannelState.players.length >= 2 &&
    !gameChannelState.players.includes(req.body.userID)
  )
    return res.status(400).json({
      success: false,
    });

  // put user in game
  const newPlayers = [
    ...new Set([...gameChannelState.players, req.body.userID]),
  ];

  const turn =
    newPlayers.length === 2
      ? gameChannelState.turn === ""
        ? Math.random() < 0.5
          ? newPlayers[0]
          : newPlayers[1]
        : gameChannelState.turn
      : "";

  if (!gameChannelState.players.includes(req.body.userID)) {
    await hop.channels.setState(gameID, {
      ...gameChannel.state,
      players: newPlayers,
      turn,
    });
  }

  // player join
  hop.channels.publishMessage(gameID, MESSAGE_NAMES.PLAYER_JOIN, {
    userId: req.body.userID,
    players: newPlayers,
    turn,
  });

  return res.status(200).json({
    id: gameChannel.id,
    board: gameChannelState.board,
    players: newPlayers,
    turn,
    winner: gameChannelState.winner,
    created_at: gameChannelState.created_at,
  });
}
