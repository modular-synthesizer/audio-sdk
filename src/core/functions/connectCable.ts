import type { Cable } from "@jsynple/core";
import { connectLink } from "./connectLink.js";

export async function connectCable(cable: Cable) {
  const from = cable.from.payload.target
  const to = cable.to.payload.target
  console.debug(`    [CABLE] Initializing cable between ${from.target.name} and ${to.target.name}`)
  await connectLink(from.target, to.target, from.index, to.index)
}