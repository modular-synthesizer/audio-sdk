import type { ModuleLink } from "@jsynple/core";
import { connectLink } from "./connectLink.js";

export async function initLink(link: ModuleLink) {
  await connectLink(link.from.node, link.to.node, link.from.index, link.to.index)
}