import type { NodeGenerator, Synthesizer } from "@jsynple/core";
import { connectCable } from "./connectCable.js";
import { initAudioModule } from "./initAudioModule.js";

export async function initSynthesizer(synthesizer: Synthesizer, generators: NodeGenerator[], context: AudioContext): Promise<void> {
  console.debug(`[SYNTHESIZER] Initializing ${synthesizer.id}`)
  const modules = Object.values(synthesizer.modules)
  console.debug("[SYNTHESIZER] Initializing modules")
  await Promise.all(modules.map(m => initAudioModule(m, generators, synthesizer, context)))
  console.debug("[SYNTHESIZER] Initializing cables")
  await Promise.all(synthesizer.cables.map(connectCable))
}