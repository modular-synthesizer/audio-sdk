import { describe, expect, it } from "vitest"
import { initSynthesizer } from "../../../src/core/functions/initSynthesizer";
import { SynthesizerFactory } from "../../factories/SynthesizerFactory";
import { MonophonicNodeFactory, PolyphonicNodeFactory } from "../../factories/NodeFactory";
import type { NodeGenerator, Synthesizer } from "@jsynple/core";

describe("initSynthesizer", async () => {
  const generators: NodeGenerator[] = [
    { id: "id1", name: "generator", code: "return new OscillatorNode(context, { frequency: 300 })" },
    { id: "id2", name: "error", code: "anything crashing the app" }
  ]

  const nodes = {
    poly: await PolyphonicNodeFactory(),
    mono: await MonophonicNodeFactory(),
    unknown: await PolyphonicNodeFactory({ generator: 'unknown' }),
    error: await MonophonicNodeFactory({ generator: 'error' })
  }

  const synthesizer: Synthesizer = await SynthesizerFactory({
    modules: {
      "1": {
        rack: 0,
        slot: 0,
        slots: 2,
        id: "1",
        nodes: {
          [nodes.error.id]: nodes.error,
          [nodes.mono.id]: nodes.mono
        },
        links: {},
        ports: {},
        parameters: {},
        controls: [],
      },
      "2": {
        rack: 0,
        slot: 0,
        slots: 2,
        id: "2",
        nodes: {
          [nodes.unknown.id]: nodes.unknown,
          [nodes.poly.id]: nodes.poly
        },
        links: {},
        ports: {},
        parameters: {},
        controls: [],
      },
    }
  })

  const context = new AudioContext()

  await initSynthesizer(synthesizer, generators, context)

  describe("The polyphonic node", () => {
    it("Has correctly created four nodes", () => {
      expect(nodes.poly.audioNodes.length).toBe(4)
    })
  })
  describe("The monophonic node", () => {
    it("Has created a node", () => {
      expect(nodes.mono.audioNode).not.toBeUndefined()
    })
  })
  describe("The node in error with unknown generator", () => {
    it("Has created no nodes", () => {
      expect(nodes.unknown.audioNodes.length).toBe(0)
    })
  })
  describe("The node in error with crashing generator", () => {
    it("has created a simple gain node", () => {
      expect(nodes.error.audioNode).toBeInstanceOf(GainNode)
    })
  })
})