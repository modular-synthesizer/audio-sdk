import type { Cable } from "../business/Cable.type.js";
import { connectNodes } from "./connectNodes.js";

export async function connectCable(cable: Cable) {
  await connectNodes(cable.from.target, cable.to.target, cable.from.index, cable.to.index)
}