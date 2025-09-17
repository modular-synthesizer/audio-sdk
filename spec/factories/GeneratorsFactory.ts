import type { NodeGenerator } from "@jsynple/core";
import { createFactory } from "../utils/factories";

export const ConstantSource = createFactory<NodeGenerator>({
  id: () => "constantSourceId",
  name: () => "source",
  code: () => 'const n = new ConstantSourceNode(context); n.offset.setValueAtTime(0, context.currentTime); return n'
})

export const Analyser = createFactory<NodeGenerator>({
  id: () => "AnalyserId",
  name: () => "analyser",
  code: () => 'return new AnalyserNode(context, { fftSize: 32 })'
})