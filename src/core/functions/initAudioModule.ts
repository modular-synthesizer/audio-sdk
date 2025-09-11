import type { Module } from "../business/Module.type.js";
import type { NodeGenerator } from "../business/NodeGenerator.type.js";
import type { Synthesizer } from "../business/Synthesizer.type.js";
import { connectNodes } from "./connectNodes.js";
import { initAudioNodes } from "./initAudioNodes.js";

export async function initAudioModule(module: Module, generators: NodeGenerator[], synthesizer: Synthesizer, context: AudioContext): Promise<void> {
  await Promise.all(module.nodes.map(async n => await initAudioNodes(n, generators, synthesizer, context)))
  await Promise.all(module.links.map(async l => await connectNodes(l, module)))
}