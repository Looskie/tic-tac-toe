import { NextApiRequest, NextApiResponse } from "next";
import { GameState } from "../../types";
import { PROJECT_ID } from "../../utils/Commons";
import { hop } from "../../utils/Hop";

const ONE_HOUR = 60 * 60 * 1000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // cleans up games that are older than an hour
  const channels = await hop.channels.getAll(PROJECT_ID).catch(() => []);

  for (const channel of channels) {
    const channelState = channel.state as unknown as GameState;

    if (lessThanOneHourAgo(new Date(channelState.created_at))) {
      continue;
    }

    hop.channels.delete(channel.id);
  }

  res.status(200).end("Hello Cron!");
}

const lessThanOneHourAgo = (date: Date) => {
  return new Date().getTime() - date.getTime() < ONE_HOUR;
};
