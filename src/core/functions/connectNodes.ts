import type { ModuleNode } from "@jsynple/core"

type ConnectFunction = (from: AudioNode, to: AudioNode, findex: number, tindex: number) => void

export function connectNodesTemplate(connect: ConnectFunction) {
  return (from: ModuleNode, to: ModuleNode, fromIndex: number, toIndex: number) => {
    try {
      if (!from.polyphonic && !to.polyphonic && from.audioNode && to.audioNode) {
        connect(from.audioNode, to.audioNode, fromIndex, toIndex)
      }
      if (from.polyphonic && !to.polyphonic && to.audioNode) {
        for (const n of from.audioNodes) connect(n, to.audioNode, fromIndex, toIndex)
      }
      if (!from.polyphonic && to.polyphonic && from.audioNode) {
        for (const n of to.audioNodes) {
          connect(from.audioNode, n, fromIndex, toIndex)
        }
      }
      if (from.polyphonic && to.polyphonic) {
        const voices = Math.min(from.audioNodes.length, to.audioNodes.length)
        for (let i = 0; i < voices; ++i) {
          connect(from.audioNodes[i] as AudioNode, to.audioNodes[i] as AudioNode, fromIndex, toIndex)
        }
      }
    }
    catch (exception) {
      console.error(exception)
    }
  }
}

export const connectNodes = connectNodesTemplate(connectAudio)

function connectAudio(from: AudioNode, to: AudioNode, findex: number, tindex: number) {
  from?.connect(to, findex, tindex)
}