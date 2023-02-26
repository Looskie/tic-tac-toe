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
  const gameChannel = await hop.channels.get(gameID);

  const gameChannelState = gameChannel.state as unknown as GameState;

  if (!gameChannel)
    return res.status(404).json({
      success: false,
    });
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
    gameChannelState.turn === ""
      ? Math.random() > 0.5
        ? gameChannelState.players[0]
        : req.body.userID
      : gameChannelState.turn;

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
  });

  // starts game

  /* check if it is 1 because the player is already in the game and we fetch new
   state (so its assumed that they are both in now) */
  if (gameChannelState.players.length > 1) {
    hop.channels.publishMessage(gameID, MESSAGE_NAMES.START_GAME, {});
  }

  return res.status(200).json({
    id: gameChannel.id,
    board: gameChannelState.board,
    players: newPlayers,
    turn,
    winner: gameChannelState.winner,
  });
}
