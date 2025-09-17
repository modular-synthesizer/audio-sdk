import type { NodeGenerator, Synthesizer } from "@jsynple/core";
import { connectCable } from "./connectCable.js";
import { initAudioModule } from "./initAudioModule.js";

export async function initSynthesizer(synthesizer: Synthesizer, generators: NodeGenerator[], context: AudioContext): Promise<void> {
  console.log("Initializing synthesizer sound system...")
  const modules = Object.values(synthesizer.modules)
  await Promise.all(modules.map(m => initAudioModule(m, generators, synthesizer, context)))
  await Promise.all(synthesizer.cables.map(connectCable))
}