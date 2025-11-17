import { describe, vi, test, expect } from "vitest";
import { SynthesizerFactory } from "../../factories/SynthesizerFactory";
import { ConstantSource } from "../../factories/GeneratorsFactory";
import { bootSynthesizerTemplate } from "../../../src/core/features/bootSynthesizer"

describe("Given a user logged into the application", () => {
  describe("When I try to fetch a synthesizer and initialize its audio engine", async () => {
    const fakes = {
      context: new AudioContext(),
      synthesizer: await SynthesizerFactory(),
      generators: [await ConstantSource()]
    }
    const mocks = {
      getSynthesizer: vi.fn().mockReturnValue(fakes.synthesizer),
      getAllGenerators: vi.fn().mockReturnValue({ ok: true, data: fakes.generators }),
      initSynthesizer: vi.fn()
    }
    const spy = vi.spyOn(mocks, "initSynthesizer")
    const bootSynthesizer = bootSynthesizerTemplate(
      mocks.getSynthesizer,
      mocks.getAllGenerators,
      mocks.initSynthesizer
    )
    const synthesizer = await bootSynthesizer("synthesizer-id", "auth_token")
    test("then I get a synthesizer with the correct informations", () => {
      expect(synthesizer).toMatchObject({
        id: "test-id"
      })
    })
    test("and the synthesizer audio nodes are correctly initialized", () => {
      expect(spy).toHaveBeenCalledExactlyOnceWith(fakes.synthesizer, fakes.generators, fakes.context)
    })
  })
})