import type { NodeGenerator } from "../business/NodeGenerator.type.js";
import type { Synthesizer } from "../business/Synthesizer.type.js";
import { connectCable } from "./connectCable.js";
import { initAudioModule } from "./initAudioModule.js";

export async function initSynthesizer(synthesizer: Synthesizer, generators: NodeGenerator[], context: AudioContext): Promise<void> {
  console.log("Initializing synthesizer sound system...")
  await Promise.all(synthesizer.modules.map(m => initAudioModule(m, generators, synthesizer, context)))
  await Promise.all(synthesizer.cables.map(connectCable))
}