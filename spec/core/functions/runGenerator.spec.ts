import { beforeEach, describe, expect, it, vi } from "vitest";
import { runGeneratorTemplate } from "../../../src/core/functions/runGenerator.js";
import type { NodeGenerator } from "@jsynple/core";

describe("runGenerator", () => {

  const mocks = { start: vi.fn() }

  const spy = vi.spyOn(mocks, "start")

  const runGenerator = runGeneratorTemplate(mocks.start)

  beforeEach(() => {
    vi.resetAllMocks()
    vi.clearAllMocks()
  })

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
    it("Has correctly started the node as it is an oscillator", async () => {
      const spy = vi.spyOn(mocks, 'start')
      await runGeneratorTemplate(mocks.start)(generator, new AudioContext())
      expect(spy).toHaveBeenCalledOnce()
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
        expect((audioNode as GainNode).gain.value).toEqual(1)
      })
    })
    describe("When the node is supposed to be started", () => {
      describe("With an oscillator node", async () => {
        const generator: NodeGenerator = {
          name: 'testGenerator',
          id: 'testGeneratorId',
          code: 'return new OscillatorNode(context, {frequency: 42})'
        }

        it("Has started the node correctly", async () => {
          await runGenerator(generator, new AudioContext())
          expect(spy).toHaveBeenCalledOnce()
        })
      })
      describe("With a constant source node", () => {

        const generator: NodeGenerator = {
          name: 'testGenerator',
          id: 'testGeneratorId',
          code: 'return new ConstantSourceNode(context, {offset: 42})'
        }

        it("Has started the node correctly", async () => {
          console.log("AVANT LE TEST")
          await runGenerator(generator, new AudioContext())
          expect(spy).toHaveBeenCalledOnce()
        })
      })
    })
  })
})