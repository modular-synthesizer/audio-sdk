import type { NodeGenerator } from "../business/NodeGenerator.type.js";
import type { Synthesizer } from "../business/Synthesizer.js";
import { initAudioModule } from "./initAudioModule.js";

export async function initSynthesizer(synthesizer: Synthesizer, generators: NodeGenerator[], context: AudioContext): Promise<void> {
  await Promise.all(synthesizer.modules.map(m => initAudioModule(m, generators, synthesizer, context)))
}