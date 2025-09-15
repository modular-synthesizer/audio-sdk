import { Synthesizer } from "@synple/core";
import { createFactory } from "../utils/factories";

export const SynthesizerFactory = createFactory<Synthesizer>({
  voices: () => 4,
  modules: () => [],
  cables: () => [],
  ports: () => ({})
})