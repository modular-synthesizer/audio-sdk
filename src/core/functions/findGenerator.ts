import type { ModuleNode } from "../business/ModuleNode.type.js";
import type { NodeGenerator } from "../business/NodeGenerator.type.js";

export class GeneratorNotFound extends Error {}

export function findGenerator(generators: NodeGenerator[], node: ModuleNode): NodeGenerator {
  const found: NodeGenerator | undefined = generators.find(g => g.name === node.generator)
  if (!found) throw new GeneratorNotFound()
  return found
}