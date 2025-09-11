import type { Synthesizer } from "../../src/core/business/Synthesizer.type";
import { createFactory } from "../utils/factories";

export const SynthesizerFactory = createFactory<Synthesizer>({
  voices: () => 4,
  modules: () => [],
  cables: () => [],
  ports: () => ({})
})