import type { Parameter } from "@jsynple/core";

export async function setValue(parameter: Parameter, value: number) {
  const { maximum: max, minimum: min, value: v } = parameter
  const clampedValue = Math.min(Math.max(min, value), max)
  await setClampedValue(parameter, clampedValue)
}

async function setClampedValue(parameter: Parameter, value: number) {
  parameter.value = value
  for(const t of parameter.targets) {
    if (t.polyphonic) {
      for (const n of t.audioNodes) {
        setValueFor(n, parameter.field, value)
      }
    }
    else if (t.audioNode) {
      setValueFor(t.audioNode, parameter.field, value)
    }
  }
}

function getParameter(node: AudioNode, name: string): AudioParam {
  if (node instanceof AudioWorkletNode) return node.parameters.get(name) as AudioParam
  return node[name as keyof AudioNode] as unknown as AudioParam
}

async function setValueFor(node: AudioNode, name: string, value: number): Promise<void> {
  const audioParam = getParameter(node, name);
  audioParam.setValueAtTime(Math.fround(value), 0)
}