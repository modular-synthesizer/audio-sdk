import type { Module, NodeGenerator, Synthesizer } from "@synple/core";
import { initAudioNodes } from "./initAudioNodes.js";
import { initLink } from "./initLink.js";

export async function initAudioModule(module: Module, generators: NodeGenerator[], synthesizer: Synthesizer, context: AudioContext): Promise<void> {
  const nodes = Object.values(module.nodes)
  const links = Object.values(module.links)
  await Promise.all(nodes.map(async n => await initAudioNodes(n, generators, synthesizer, context)))
  await Promise.all(links.map(async l => await initLink(l)))
}