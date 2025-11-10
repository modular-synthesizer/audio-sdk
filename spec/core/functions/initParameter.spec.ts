import { beforeEach, describe, expect, it, vi } from "vitest";
import { initParameterTemplate } from "../../../src/core/functions/initParameter"
import type { Module, NodeGenerator, Parameter, Synthesizer } from "@jsynple/core";
import { MonophonicNodeFactory, PolyphonicNodeFactory } from "../../factories/NodeFactory";
import { initAudioNodes } from "../../../src/core/functions/initAudioNodes";

describe("initParameter", async () => {
  const fakes = { setValue: vi.fn() }
  const spy = vi.spyOn(fakes, "setValue")
  const initParameter = initParameterTemplate(fakes.setValue)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  const nodes = {
    poly: await PolyphonicNodeFactory(),
    mono: await MonophonicNodeFactory(),
  }
  
  const generators: NodeGenerator[] = [
    { id: "id", name: "generator", code: "return new GainNode(context)" }
  ]

  const parameter: Parameter = {
    id: "parameter-id",
    name: "parameter",
    targets: [ ],
    field: 'gain',
    t: new Date(),
    value: 1.1,
    minimum: 1,
    maximum: 2,
    step: .1,
    precision: 1
  }
  const module: Module = {
    id: "module-id",
    links: {},
    ports: {},
    nodes,
    parameters: { parameter }
  }
  const context = new AudioContext()
  const synthesizer: Synthesizer = {
    id: "synth-id",
    name: "synth",
    voices: 2,
    cables: [],
    x: 0, y: 0, scale: 1.0,
    modules: { "module-id": module }
  }

  await initAudioNodes(nodes.mono, generators, synthesizer, context)
  await initAudioNodes(nodes.poly, generators, synthesizer, context)

  describe("Applied on a monophonic node", () => {
    beforeEach(() => {
      initParameter({...parameter, targets: [nodes.mono]}, context)
    })
    it("Has called the setter only once", () => {
      // @ts-ignore
      expect(spy).toHaveBeenCalledExactlyOnceWith(nodes.mono.audioNode.gain, 1.1, context)
    })
  })

  describe("Applied on a polyphonic node", () => {
    beforeEach(() => {
      initParameter({...parameter, targets: [nodes.poly]}, context)
    })
    it("Has called the setter twice with the correct arguments", () => {
      // @ts-ignore
      expect(spy).toHaveBeenNthCalledWith(1, nodes.poly.audioNodes[0].gain, 1.1, context)
      // @ts-ignore
      expect(spy).toHaveBeenNthCalledWith(1, nodes.poly.audioNodes[1].gain, 1.1, context)
    })
  })
})