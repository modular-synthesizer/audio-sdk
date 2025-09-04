import { describe, expect, it } from "vitest";
import type { NodeGenerator } from "../../../src/core/business/NodeGenerator.type.js";
import { runGenerator } from "../../../src/core/functions/runGenerator.js";

describe("runGenerator", () => {
  const generator: NodeGenerator = {
    name: 'testGenerator',
    id: 'testGeneratorId',
    code: 'return new OscillatorNode(context, {frequency: 440})'
  }
  it("Correctly runs a generator", async () => {
    expect(await runGenerator(generator, new AudioContext())).toBeInstanceOf(OscillatorNode)
  })
})