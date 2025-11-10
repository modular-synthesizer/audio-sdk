export function getParameter(node: AudioNode, name: string): AudioParam {
  if (node instanceof AudioWorkletNode) return node.parameters.get(name) as AudioParam
  return node[name as keyof typeof node] as unknown as AudioParam
}