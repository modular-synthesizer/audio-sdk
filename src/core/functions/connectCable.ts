import type { Cable } from "@synple/core";
import { connectNodes } from "./connectNodes.js";

export async function connectCable(cable: Cable) {
  await connectNodes(cable.from.target, cable.to.target, cable.from.index, cable.to.index)
}