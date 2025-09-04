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

    it("Correctly runs a generator", () => {
      expect(audioNode).toBeInstanceOf(OscillatorNode)
    })
    it("Has set the correct value for the frequency", () => {
      expect((audioNode as OscillatorNode).frequency.value).toEqual(42)
    })
  })
  describe("alternative cases", () => {
    describe("When the code is supposed to fail with an exception", async () => {
      const generator: NodeGenerator = {
        name: 'testGenerator',
        id: 'testGeneratorId',
        code: 'throw "test"'
      }
      const audioNode: AudioNode = await runGenerator(generator, new AudioContext())

      it("Returns a classic gain node", () => {
        expect(audioNode).toBeInstanceOf(GainNode)
      })
      it("Returns a gain node with a gain set to 1", () => {
        expect((audioNode as GainNode).gain.value).toEqual(1)
      })
    })
    describe("When the code fails unexpectedly, for example from a syntax error", async () => {
      const generator: NodeGenerator = {
        name: 'testGenerator',
        id: 'testGeneratorId',
        code: 'strange syntax error'
      }
      const audioNode: AudioNode = await runGenerator(generator, new AudioContext())

      it("Returns a classic gain node", () => {
        expect(audioNode).toBeInstanceOf(GainNode)
      })
      it("Returns a gain node with a gain set to 1", () => {
        expect((audioNode as GainNode).gain.value).toEqual(1  )
      })
    })
  })
})