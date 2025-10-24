import type { ModuleLink, ModuleNode } from "@jsynple/core"
import { getParameter } from "./getParameter.js"

type ConnectFunction = (from: AudioNode, to: AudioNode | AudioParam, findex: number, tindex?: number) => void

function getDestination(audioNode: AudioNode, via?: ModuleLink): AudioNode | AudioParam {
  return via?.toParameter ? getParameter(audioNode, via.parameter) : audioNode
}

export function connectLinkTemplate(connect: ConnectFunction) {
  return (from: ModuleNode, to: ModuleNode, fromIndex: number, toIndex?: number, via?: ModuleLink) => {
    try {
      if (!from.polyphonic && !to.polyphonic && from.audioNode && to.audioNode) {
        connect(from.audioNode, getDestination(to.audioNode, via), fromIndex, toIndex)
      }
      if (from.polyphonic && !to.polyphonic && to.audioNode) {
        for (const n of from.audioNodes) connect(n, getDestination(to.audioNode, via), fromIndex, toIndex)
      }
      if (!from.polyphonic && to.polyphonic && from.audioNode) {
        for (const n of to.audioNodes) {
          connect(from.audioNode, getDestination(n, via), fromIndex, toIndex)
        }
      }
      if (from.polyphonic && to.polyphonic) {
        const voices = Math.min(from.audioNodes.length, to.audioNodes.length)
        for (let i = 0; i < voices; ++i) {
          connect(from.audioNodes[i] as AudioNode, getDestination(to.audioNodes[i], via) as AudioNode, fromIndex, toIndex)
        }
      }
    }
    catch (exception) {
      console.error(exception)
    }
  }
}

export const connectLink = connectLinkTemplate(connectAudio)

function connectAudio(from: AudioNode, to: AudioNode | AudioParam, findex: number, tindex?: number) {
  to instanceof AudioNode ? from?.connect(to, findex, tindex) : from?.connect(to, findex)
}