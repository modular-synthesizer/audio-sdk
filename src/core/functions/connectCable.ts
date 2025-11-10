import type { Cable } from "@jsynple/core";
import { connectLink } from "./connectLink.js";

export async function connectCable(cable: Cable) {
  console.debug(`    [CABLE] Initializing cable between ${cable.from.target.name} and ${cable.to.target.name}`)
  await connectLink(cable.from.target, cable.to.target, cable.from.index, cable.to.index)
}