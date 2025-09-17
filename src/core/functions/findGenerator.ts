import type { ModuleNode, NodeGenerator } from "@jsynple/core"

export class GeneratorNotFound extends Error { }

export function findGenerator(generators: NodeGenerator[], node: ModuleNode): NodeGenerator {
  const found: NodeGenerator | undefined = generators.find(g => g.name === node.generator)
  if (!found) throw new GeneratorNotFound()
  return found
}