import { describe, expect, it } from "vitest";
import { initAudioModule } from "../../../src/core/functions/initAudioModule"
import { Module, MonophonicNode, NodeGenerator, PolyphonicNode } from "@synple/core";

describe("initAudioModule", async () => {
  const polyphonicNode: PolyphonicNode = { id: "1", name: "first", polyphonic: true, audioNodes: [], generator: "generator" }
  const monophonicNode: MonophonicNode = { id: "2", name: "second", polyphonic: false, generator: "generator" }
  const module: Module = {
    id: "test-id",
    nodes: {
      [monophonicNode.id]: monophonicNode,
      [polyphonicNode.id]: polyphonicNode
    },
    links: {}
  }
  const generators: NodeGenerator[] = [
    { id: "genid", name: "generator", code: "return new BiquadFilterNode(context, { frequency: 300 })" }
  ]
  const synthesizer = { voices: 4, modules: {}, id: "synth-id", name: "synth name", cables: [], ports: {} }
  const context = new AudioContext()
  await initAudioModule(module, generators, synthesizer, context)

  describe("Polyphonic node", () => {
    it("Has correctly created an array of four audio nodes", () => {
      expect(polyphonicNode.audioNodes.length).toBe(4)
    })
    it("Has created only Biquad filters", () => {
      expect(polyphonicNode.audioNodes.filter(n => n instanceof BiquadFilterNode).length).toBe(4)
    })
    it("Has created biquads with the correct frequencies", () => {
      expect(polyphonicNode.audioNodes.filter(n => (n as BiquadFilterNode).frequency.value === 300).length).toBe(4)
    })
  })
  describe("Monophonic node", () => {
    it("Has created a biquad filter", () => {
      expect(monophonicNode.audioNode).toBeInstanceOf(BiquadFilterNode)
    })
    it("Has created a biquad with the correct frequency", () => {
      expect((monophonicNode.audioNode as BiquadFilterNode).frequency.value).toBe(300)
    })
  })
})