import type { Cable } from "./Cable.type.js"
import type { Module } from "./Module.type.js"
import type { Port } from "./Port.type.js"

export type Synthesizer = {
  voices: number
  modules: Module[]
  cables: Cable[]
  // Ports are indexed on their names so that they can easily be accessed to (dis)connect a cable
  ports: Record<string, Port>
}