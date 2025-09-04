import { describe, expect, it } from "vitest"
import type { NodeGenerator } from "../../../src/core/business/NodeGenerator.type";
import type { MonophonicNode, PolyphonicNode } from "../../../src/core/business/ModuleNode.type";
import { initSynthesizer } from "../../../src/core/functions/initSynthesizer";

describe("initSynthesizer", async () => {
  const generators: NodeGenerator[] = [
    { id: "id1", name: "generator", code: "return new OscillatorNode(context, { frequency: 300 })"},
    { id: "id2", name: "error", code: "anything crashing the app"}
  ]
  const polyphonicNode: PolyphonicNode = { id: "1", name: "gain", generator: "generator", polyphonic: true, audioNodes: [] }
  const monophonicNode: MonophonicNode = { id: "2", name: "gain", generator: "generator", polyphonic: false }
  const genUnknowNode: PolyphonicNode = { id: "3", name: "gain", generator: "unknown", polyphonic: true, audioNodes: [] }
  const genErrorNode: MonophonicNode = { id: "3", name: "gain", generator: "error", polyphonic: false }

  const synthesizer = {
    voices: 4,
    modules: [
      { id: "1", nodes: [ genErrorNode, monophonicNode] },
      { id: "2", nodes: [ genUnknowNode, polyphonicNode ]}
    ]
  }

  const context = new AudioContext()

  await initSynthesizer(synthesizer, generators, context)

  describe("The polyphonic node", () => {
    it("Has correctly created four nodes", () => {
      expect(polyphonicNode.audioNodes.length).toBe(4)
    })
  })
  describe("The monophonic node", () => {
    it("Has created a node", () => {
      expect(monophonicNode.audioNode).not.toBeUndefined()
    })
  })
  describe("The node in error with unknown generator", () => {
    it("Has created no nodes", () => {
      expect(genUnknowNode.audioNodes.length).toBe(0)
    })
  })
  describe("The node in error with crashing generator", () => {
    it("has created a simple gain node", () => {
      expect(genErrorNode.audioNode).toBeInstanceOf(GainNode)
    })
  })
})