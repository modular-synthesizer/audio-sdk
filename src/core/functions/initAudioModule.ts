import type { Module, NodeGenerator, Synthesizer } from "@jsynple/core";
import { initAudioNodes } from "./initAudioNodes.js";
import { initLink } from "./initLink.js";
import { initParameter } from "./initParameter.js";

export async function initAudioModule(module: Module, generators: NodeGenerator[], synthesizer: Synthesizer, context: AudioContext): Promise<void> {
  console.debug(`    [MODULE] Initializing module ${module.id}`)
  const nodes = Object.values(module.nodes)
  const links = Object.values(module.links)
  const params = Object.values(module.parameters)
  console.debug("    [MODULE] Initializing nodes")
  await Promise.all(nodes.map(async n => await initAudioNodes(n, generators, synthesizer, context)))
  console.debug("    [MODULE] Initializing links")
  await Promise.all(links.map(async l => await initLink(l)))
  console.debug("    [MODULE] Initializing parameterz")
  await Promise.all(params.map(async p => initParameter(p, context)))
}