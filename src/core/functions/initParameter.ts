import type { Module, Parameter } from "@jsynple/core";

type ValueSetter = (param: AudioParam, value: number, context: AudioContext) => void

export function initParameterTemplate(setValue: ValueSetter) {
  return (parameter: Parameter, module: Module, context: AudioContext) => {
    for (const t of parameter.targets) {
      const nodes: AudioNode[] = t.polyphonic ? t.audioNodes : (t.audioNode ? [t.audioNode] : [])
      for (const node of nodes) {
        // @ts-ignore
        setValue(node[parameter.field] as AudioParam, parameter.value, context)
      }
    }
  }
}

export const setValue: ValueSetter = (p, v, ctx) => {
  p.setValueAtTime(v, ctx.currentTime)
}

export const initParameter = initParameterTemplate(setValue)