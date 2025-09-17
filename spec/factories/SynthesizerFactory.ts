import type { Synthesizer } from "@jsynple/core";
import { createFactory } from "../utils/factories";

export const SynthesizerFactory = createFactory<Synthesizer>({
  voices: () => 4,
  id: () => "test-id",
  name: () => "test name",
  modules: () => ({}),
  cables: () => [],
  ports: () => ({})
})