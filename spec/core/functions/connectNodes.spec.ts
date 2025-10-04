import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Analyser, ConstantSource } from "../../factories/GeneratorsFactory";
import { MonophonicNodeFactory, PolyphonicNodeFactory } from "../../factories/NodeFactory";
import { initAudioNodes } from "../../../src/core/functions/initAudioNodes";
import { connectLinkTemplate } from '../../../src/core/functions/connectLink'
import type { Module, ModuleLink, NodeGenerator, Synthesizer } from "@jsynple/core";
import { listFactory } from "../../factories/lists";

describe("connectLink", async () => {
  const generators: NodeGenerator[] = await Promise.all([Analyser(), ConstantSource()])
  const nodes = {
    analysers: {
      mono: await MonophonicNodeFactory({ generator: "analyser", name: 'manalyser' }),
      poly: await PolyphonicNodeFactory({ generator: "analyser", name: 'panalyser' })
    },
    sources: {
      mono: await MonophonicNodeFactory({ generator: "source", name: 'msource' }),
      poly: await PolyphonicNodeFactory({ generator: "source", name: 'psource' })
    }
  }
  const links: Record<string, ModuleLink> = listFactory([
    { id: '1', from: { node: nodes.sources.mono, index: 0 }, to: { node: nodes.analysers.mono, index: 1 }, toParameter: false },
    { id: '2', from: { node: nodes.sources.mono, index: 2 }, to: { node: nodes.analysers.poly, index: 3 }, toParameter: false },
    { id: '3', from: { node: nodes.sources.poly, index: 4 }, to: { node: nodes.analysers.mono, index: 5 }, toParameter: false },
    { id: '3', from: { node: nodes.sources.poly, index: 6 }, to: { node: nodes.analysers.poly, index: 7 }, toParameter: false },
  ])
  const module: Module = {
    id: 'moduleId',
    nodes: listFactory([nodes.sources.mono, nodes.sources.poly, nodes.analysers.mono, nodes.analysers.poly]),
    links,
    ports: {}
  }
  const synthesizer: Synthesizer = {
    voices: 2,
    modules: listFactory([module]),
    cables: [],
    id: "synth-id",
    name: "synth name",
    x: 0,
    y: 0,
    scale: 1.0
  }
  const context = new AudioContext()

  const mocks = {
    connect: vi.fn()
  }
  const spy = vi.spyOn(mocks, 'connect')
  const connectLink = connectLinkTemplate(mocks.connect)

  beforeAll(async () => {
    await initAudioNodes(nodes.sources.mono, generators, synthesizer, context)
    await initAudioNodes(nodes.analysers.mono, generators, synthesizer, context)
    await initAudioNodes(nodes.sources.poly, generators, synthesizer, context)
    await initAudioNodes(nodes.analysers.poly, generators, synthesizer, context)
  })

  beforeEach(() => {
    vi.resetAllMocks()
    vi.clearAllMocks()
  })

  describe("Mono to Mono", () => {
    it("Correctly connects two monophonic nodes", async () => {
      connectLink(nodes.sources.mono, nodes.analysers.mono, 0, 1)
      expect(spy).toHaveBeenCalledExactlyOnceWith(nodes.sources.mono.audioNode, nodes.analysers.mono.audioNode, 0, 1)
    })
  })

  describe("Mono to Poly", () => {
    beforeEach(() => connectLink(nodes.sources.mono, nodes.analysers.poly, 2, 3))

    it("Correctly connects a monophonic node the first polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(1, nodes.sources.mono.audioNode, nodes.analysers.poly.audioNodes[0], 2, 3)
    })
    it("Correctly connects a monophonic node the second polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(2, nodes.sources.mono.audioNode, nodes.analysers.poly.audioNodes[1], 2, 3)
    })
  })

  describe("Poly to Mono", () => {
    beforeEach(() => connectLink(nodes.sources.poly, nodes.analysers.mono, 4, 5))

    it("Correctly connects a monophonic node the first polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(1, nodes.sources.poly.audioNodes[0], nodes.analysers.mono.audioNode, 4, 5)
    })
    it("Correctly connects a monophonic node the second polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(1, nodes.sources.poly.audioNodes[1], nodes.analysers.mono.audioNode, 4, 5)
    })
  })

  describe("Poly to Poly", () => {
    beforeEach(() => connectLink(nodes.sources.poly, nodes.analysers.poly, 6, 7))

    it("Correctly connects a monophonic node the first polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(1, nodes.sources.poly.audioNodes[0], nodes.analysers.poly.audioNodes[0], 6, 7)
    })
    it("Correctly connects a monophonic node the second polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(1, nodes.sources.poly.audioNodes[1], nodes.analysers.poly.audioNodes[1], 6, 7)
    })
  })
})