import { ModuleNode } from "@synple/core";

export function listFactory<T extends { id: string }>(nodes: T[]): Record<string, T> {
  return Object.fromEntries(nodes.map(n => [n.id, n]))
}