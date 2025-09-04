import type { Synthesizer } from "../../src/core/business/Synthesizer";
import { createFactory } from "../utils/factories";

export const SynthesizerFactory = createFactory<Synthesizer>({
  voices: () => 4,
  modules: () => []
})