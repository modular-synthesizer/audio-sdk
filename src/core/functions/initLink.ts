import type { Module } from "../business/Module.type.js";
import type { ModuleLink } from "../business/ModuleLink.type.js";
import { connectNodes } from "./connectNodes.js";
import { findNode, NodeNotFound } from "./findNode.js";

export async function initLink(link: ModuleLink, module: Module) {
  try {
    const from = findNode(module, link.from.node)
    const to = findNode(module, link.to.node)

    if (from && to) await connectNodes(from, to, link.from.index, link.to.index)
  }
  catch(exception) {
    console.log("Node not found", (exception as NodeNotFound).message)
  }
}