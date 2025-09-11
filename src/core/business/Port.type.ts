import type { Cable } from "./Cable.type.js"
import type { ModuleNode } from "./ModuleNode.type.js"

export type PortKind = 'input' | 'output'

export type Port = {
  id: string
  name: string
  kind: PortKind
  // Specifies the target of the port so that cables can easily be (un)plugged
  target: ModuleNode
  // Defined only when a cable is already plugged in the port so that none other can be.
  cable?: Cable
}