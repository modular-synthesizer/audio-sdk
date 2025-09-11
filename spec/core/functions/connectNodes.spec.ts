import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { NodeGenerator } from "../../../src/core/business/NodeGenerator.type";
import { Analyser, ConstantSource } from "../../factories/GeneratorsFactory";
import { MonophonicNodeFactory, PolyphonicNodeFactory } from "../../factories/NodeFactory";
import { initAudioNodes } from "../../../src/core/functions/initAudioNodes";
import type { ModuleLink } from "../../../src/core/business/ModuleLink.type"
import type { Module } from "../../../src/core/business/Module.type";
import type { Synthesizer } from "../../../src/core/business/Synthesizer.type";
import { connectNodesTemplate } from '../../../src/core/functions/connectNodes'

describe("connectNodes", async () => {
  const generators: NodeGenerator[] = await Promise.all([ Analyser(), ConstantSource() ])
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
  const links: ModuleLink[] = [
    { id: '1', from: { node: 'msource', index: 0 }, to: { node: 'manalyser', index: 1 } },
    { id: '2', from: { node: 'msource', index: 2 }, to: { node: 'panalyser', index: 3 } },
    { id: '3', from: { node: 'psource', index: 4 }, to: { node: 'manalyser', index: 5 } },
    { id: '3', from: { node: 'psource', index: 6 }, to: { node: 'panalyser', index: 7 } },
  ]
  const module: Module = {
    id: 'moduleId',
    nodes: [ nodes.sources.mono, nodes.sources.poly, nodes.analysers.mono, nodes.analysers.poly ],
    links
  }
  const synthesizer: Synthesizer = {
    voices: 2,
    modules: [ module ],
    cables: [],
    ports: {}
  }
  const context = new AudioContext()

  const mocks = {
    connect: vi.fn()
  }
  const spy = vi.spyOn(mocks, 'connect')
  const connectNodes = connectNodesTemplate(mocks.connect)

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
      connectNodes(nodes.sources.mono, nodes.analysers.mono, 0, 1)
      expect(spy).toHaveBeenCalledExactlyOnceWith(nodes.sources.mono.audioNode, nodes.analysers.mono.audioNode, 0, 1)
    })
  })

  describe("Mono to Poly", () => {
    beforeEach(() => connectNodes(nodes.sources.mono, nodes.analysers.poly, 2, 3))

    it("Correctly connects a monophonic node the first polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(1, nodes.sources.mono.audioNode, nodes.analysers.poly.audioNodes[0], 2, 3)
    })
    it("Correctly connects a monophonic node the second polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(2, nodes.sources.mono.audioNode, nodes.analysers.poly.audioNodes[1], 2, 3)
    })
  })

  describe("Poly to Mono", () => {
    beforeEach(() => connectNodes(nodes.sources.poly, nodes.analysers.mono, 4, 5))

    it("Correctly connects a monophonic node the first polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(1, nodes.sources.poly.audioNodes[0], nodes.analysers.mono.audioNode, 4, 5)
    })
    it("Correctly connects a monophonic node the second polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(1, nodes.sources.poly.audioNodes[1], nodes.analysers.mono.audioNode, 4, 5)
    })
  })

  describe("Poly to Poly", () => {
    beforeEach(() => connectNodes(nodes.sources.poly, nodes.analysers.poly, 6, 7))

    it("Correctly connects a monophonic node the first polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(1, nodes.sources.poly.audioNodes[0], nodes.analysers.poly.audioNodes[0], 6, 7)
    })
    it("Correctly connects a monophonic node the second polyphonic node", async () => {
      expect(spy).toHaveBeenNthCalledWith(1, nodes.sources.poly.audioNodes[1], nodes.analysers.poly.audioNodes[1], 6, 7)
    })
  })
})