import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ModuleNode, Parameter } from "@jsynple/core"
import { setValue } from "../../../src/core/features/setValue"

describe("setParameter", () => {
  const context: AudioContext = new AudioContext();
  const node: ModuleNode = {
    id: "node-id",
    name: "node",
    generator: "createGain",
    polyphonic: false,
    audioNode: new GainNode(context, { gain: 2 })
  }
  const subject: Parameter = {
    id: "parameter-id",
    minimum: 0,
    maximum: 100,
    value: 50,
    name: 'test',
    precision: 0,
    step: 1,
    targets: [ node ],
    field: 'gain',
    t: new Date()
  }
  /**
   * We cannot just check the value of the "value" field of the node as we use the automatic orchestration
   * API to change the value with setValueAtTime. Instead, we just check that the method has been correctly
   * called with the right parameters so that we can suppose with the highest degree of confidence that the
   * value has been changed as the web audio API intends to, and documents.
   */
  const spy = vi.spyOn((node.audioNode as GainNode).gain, "setValueAtTime")
  describe("when the Value is inside the boundings of the parameter", () => {
    beforeEach(async () => {
      await setValue(subject, 10)
    })
    it("Has set the value of the parameter", () => {
      expect(subject.value).toEqual(10)
    })
    it("Has set the value of the corresponding audio node", async () => {
      expect(spy).toHaveBeenLastCalledWith(10, 0)
    })
  })
  describe("when the value is below the minimum", () => {
    it("Has clamped the value up", async () => {
      await setValue(subject, subject.minimum - 1)
      expect(subject.value).toEqual(subject.minimum)
    })
    it("Has set the value of the corresponding audio node", async () => {
      expect(spy).toHaveBeenLastCalledWith(subject.minimum, 0)
    })
  })
  describe("when the value is above the maximum", () => {
    it("Has clamped the value down", async () => {
      await setValue(subject, subject.maximum + 1)
      expect(subject.value).toEqual(subject.maximum)
    })
    it("Has set the value of the corresponding audio node", async () => {
      expect(spy).toHaveBeenLastCalledWith(subject.maximum, 0)
    })
  })
})