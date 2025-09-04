import { describe, expect, it } from "vitest";
import type { NodeGenerator } from "../../../src/core/business/NodeGenerator.type.js";
import { runGenerator } from "../../../src/core/functions/runGenerator.js";

describe("runGenerator", () => {
  describe("Nominal case", async () => {
    const generator: NodeGenerator = {
      name: 'testGenerator',
      id: 'testGeneratorId',
      code: 'return new OscillatorNode(context, {frequency: 42})'
    }
    const audioNode: AudioNode = await runGenerator(generator, new AudioContext())

    it("Correctly runs a generator", async () => {
      expect(audioNode).toBeInstanceOf(OscillatorNode)
    })
    it("Has set the correct value for the frequency", () => {
      expect((audioNode as OscillatorNode).frequency.value).toEqual(42)
    })
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