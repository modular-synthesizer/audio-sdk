import type { ModuleLink } from "@synple/core";
import { connectNodes } from "./connectNodes.js";

export async function initLink(link: ModuleLink) {
  await connectNodes(link.from.node, link.to.node, link.from.index, link.to.index)
}