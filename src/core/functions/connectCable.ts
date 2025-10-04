import type { Cable } from "@jsynple/core";
import { connectLink } from "./connectLink.js";

export async function connectCable(cable: Cable) {
  await connectLink(cable.from.target, cable.to.target, cable.from.index, cable.to.index)
}