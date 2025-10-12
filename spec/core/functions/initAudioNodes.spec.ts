import { beforeEach, describe, expect, it } from "vitest";
import { initAudioNodes } from "../../../src/core/functions/initAudioNodes"
import type { MonophonicNode, NodeGenerator, PolyphonicNode } from "@jsynple/core";

describe("initAudioNodes", () => {
  const synthesizer = { voices: 4, modules: {}, id: "synth-id", name: "synth name", cables: [], ports: {}, parameters: {}, x: 0, y: 0, scale: 1.0 }
  const generators: NodeGenerator[] = [
    { id: "id", name: "generator", code: "return new OscillatorNode(context, { frequency: 300 })" }
  ]
  const polyphonicNode: PolyphonicNode = { id: "node", name: "gain", generator: "generator", polyphonic: true, audioNodes: [] }
  const monophonicNode: MonophonicNode = { id: "node", name: "gain", generator: "generator", polyphonic: false }
  const context = new AudioContext()

  describe("Nominal case", async () => {
    beforeEach(async () => {
      await initAudioNodes(polyphonicNode, generators, synthesizer, context)
    })
    it("Has created an array of the size of the synthesizer voices", () => {
      expect(polyphonicNode.audioNodes.length).toEqual(4)
    })
    it("Has created Oscillators all the way", () => {
      expect(polyphonicNode.audioNodes.filter(n => n instanceof OscillatorNode).length).toBe(4)
    })
    it("Has correctly set the frequencies", () => {
      expect(polyphonicNode.audioNodes.filter(n => (n as OscillatorNode).frequency.value === 300).length).toBe(4)
    })
  })
  describe("Alternative cases", () => {
    describe("When the node is monophonic", async () => {
      beforeEach(async () => {
        await initAudioNodes(monophonicNode, generators, synthesizer, context)
      })
      it("Has created the node correctly", () => {
        expect(monophonicNode.audioNode).not.toBeUndefined()
      })
      it("Has created the node as an oscillator", () => {
        expect(monophonicNode.audioNode).toBeInstanceOf(OscillatorNode)
      })
      it("Has correctly set the frequency", () => {
        expect((monophonicNode.audioNode as OscillatorNode).frequency.value).toBe(300)
      })
    })
  })
  describe("Exception cases", () => {
    describe("Polyphonic node - when the generator is not found", () => {
      const node: PolyphonicNode = { ...polyphonicNode, audioNodes: [] }
      it("Has not instanciated any node", async () => {
        await initAudioNodes(node, [], synthesizer, context)
        expect(node.audioNodes.length).toBe(0)
      })
    })
    describe("Monophonic node - when a generator is not found", () => {
      const node: MonophonicNode = { ...monophonicNode, audioNode: undefined }
      it("Has not instanciated the node", async () => {
        await initAudioNodes(node, [], synthesizer, context)
        expect(node.audioNode).toBeUndefined()
      })
    })
  })
})