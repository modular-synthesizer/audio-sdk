import type { Parameter } from "@jsynple/core";
import { getParameter } from "./getParameter.js"

type ValueSetter = (param: AudioParam, value: number, context: AudioContext) => void

export function initParameterTemplate(setValue: ValueSetter) {
  return (parameter: Parameter, context: AudioContext) => {
    for (const t of parameter.targets) {
      const nodes: AudioNode[] = t.polyphonic ? t.audioNodes : (t.audioNode ? [t.audioNode] : [])
      console.debug(`            Applying value ${parameter.value} to node ${t.name} on parameter ${parameter.field}`)
      for (const node of nodes) {
        // @ts-ignore
        setValue(getParameter(node, parameter.field), parameter.value, context)
      }
    }
  }
}

export const setValue: ValueSetter = (p, v, ctx) => {
  p.setValueAtTime(v, ctx.currentTime)
}

export const initParameter = initParameterTemplate(setValue)