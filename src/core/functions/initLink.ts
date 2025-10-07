import type { ModuleLink } from "@jsynple/core";
import { connectLink } from "./connectLink.js";

export async function initLink(link: ModuleLink) {
  console.debug(`        [LINK] Creating link between ${link.from.node.name} and ${link.to.node.name}`)
  await connectLink(link.from.node, link.to.node, link.from.index, link.to.index)
}