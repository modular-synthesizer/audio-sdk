import type { Module } from "../business/Module.type.js";
import type { ModuleLink } from "../business/ModuleLink.type.js";
import { findNode } from "./findNode.js";

type ConnectFunction = (from: AudioNode, to: AudioNode, findex: number, tindex: number) => void

export function connectNodesTemplate(connect: ConnectFunction) {
  return (module: Module, link: ModuleLink) => {
    try {
      const from = findNode(module, link.from.node)
      const to = findNode(module, link.to.node)

      if (!from.polyphonic && !to.polyphonic && from.audioNode && to.audioNode) {
        connect(from.audioNode, to.audioNode, link.from.index, link.to.index)
      }
      if (from.polyphonic && !to.polyphonic && to.audioNode) {
        for (const n of from.audioNodes) connect(n, to.audioNode, link.from.index, link.to.index)
      }
      if(!from.polyphonic && to.polyphonic && from.audioNode) {
        for (const n of to.audioNodes) {
          connect(from.audioNode, n, link.from.index, link.to.index)
        }
      }
      if(from.polyphonic && to.polyphonic) {
        const voices = Math.min(from.audioNodes.length, to.audioNodes.length)
        for (let i = 0; i < voices; ++i) {
          connect(from.audioNodes[i] as AudioNode, to.audioNodes[i] as AudioNode, link.from.index, link.to.index)
        }
      }
    }
    catch(exception) {
      console.error(exception)
    }
  }
}

export const connectNodes = connectNodesTemplate(connectAudio)

function connectAudio(from: AudioNode, to: AudioNode, findex: number, tindex: number) {
  from?.connect(to, findex, tindex)
}