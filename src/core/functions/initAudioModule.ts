import type { Module } from "../business/Module.type.js";
import type { NodeGenerator } from "../business/NodeGenerator.type.js";
import type { Synthesizer } from "../business/Synthesizer.js";
import { initAudioNodes } from "./initAudioNodes.js";

export async function initAudioModule(module: Module, generators: NodeGenerator[], synthesizer: Synthesizer, context: AudioContext): Promise<void> {
  await Promise.all(module.nodes.map(n => initAudioNodes(n, generators, synthesizer, context)))
}