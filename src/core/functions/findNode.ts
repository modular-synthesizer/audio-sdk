import type { Module } from "../business/Module.type.js";
import type { ModuleNode } from "../business/ModuleNode.type.js";

export class NodeNotFound extends Error { }

export function findNode(module: Module, name: string): ModuleNode {
  const found: ModuleNode | undefined = module.nodes.find(n => n.name === name)
  if (!found) throw new NodeNotFound(name)
  return found
}