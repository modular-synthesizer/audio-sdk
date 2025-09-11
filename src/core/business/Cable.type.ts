import type { ModuleNode } from "./ModuleNode.type.js"
import type { Port } from "./Port.type.js"

/**
 * A cable is a link between two modules, connected by specified ports. It is not a link between
 * two internal nodes, but rather a graphically represented item on a synthesizer board.
 */
export type Cable = {
  id: string
  // The UUID of the port you're trying to reach.
  from: Port
  to: Port
}