import type { Module } from "../business/Module.type.js";
import type { NodeGenerator } from "../business/NodeGenerator.type.js";
import type { Synthesizer } from "../business/Synthesizer.type.js";
import { initAudioNodes } from "./initAudioNodes.js";
import { initLink } from "./initLink.js";

export async function initAudioModule(module: Module, generators: NodeGenerator[], synthesizer: Synthesizer, context: AudioContext): Promise<void> {
  await Promise.all(module.nodes.map(async n => await initAudioNodes(n, generators, synthesizer, context)))
  await Promise.all(module.links.map(async l => await initLink(l, module)))
}