import { describe, expect, it } from "vitest";
import type { NodeGenerator } from "../../../src/core/business/NodeGenerator.type.js";
import { runGenerator } from "../../../src/core/functions/runGenerator.js";

describe("runGenerator", () => {
  it("Correctly runs a generator", async () => {
    const generator: NodeGenerator = {
      name: 'testGenerator',
      id: 'testGeneratorId',
      code: 'return new OscillatorNode(context, {frequency: 440})'
    }
    expect(await runGenerator(generator, new AudioContext())).toBeInstanceOf(OscillatorNode)
  })
  it("correctly fails when a generator properly throws an error", async () => {
    const generator: NodeGenerator = {
      name: 'testGenerator',
      id: 'testGeneratorId',
      code: 'throw "test"'
    }
    expect(await runGenerator(generator, new AudioContext())).toBeInstanceOf(GainNode)
  })
  it("correctly fails when there is a syntax error", async () => {
    const generator: NodeGenerator = {
      name: 'testGenerator',
      id: 'testGeneratorId',
      code: 'syntax error everywhere'
    }
    expect(await runGenerator(generator, new AudioContext())).toBeInstanceOf(GainNode)
  })
})