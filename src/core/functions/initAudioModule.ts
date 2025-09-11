import type { Module } from "../business/Module.type.js";
import type { NodeGenerator } from "../business/NodeGenerator.type.js";
import type { Synthesizer } from "../business/Synthesizer.type.js";
import { connectNodes } from "./connectNodes.js";
import { findNode } from "./findNode.js";
import { initAudioNodes } from "./initAudioNodes.js";

export async function initAudioModule(module: Module, generators: NodeGenerator[], synthesizer: Synthesizer, context: AudioContext): Promise<void> {
  await Promise.all(module.nodes.map(async n => await initAudioNodes(n, generators, synthesizer, context)))
  await Promise.all(module.links.map(async l => {
    const from = findNode(module, l.from.node)
    const to = findNode(module, l.to.node)

    if (from && to) await connectNodes(from, to, l.from.index, l.to.index)
  }))
}