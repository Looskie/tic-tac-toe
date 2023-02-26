import { Hop, Id } from "@onehop/js";

export const hop = new Hop(process.env.PROJECT_TOKEN as Id<"ptk">);
