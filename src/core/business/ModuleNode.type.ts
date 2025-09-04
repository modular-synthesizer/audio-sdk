export type BaseNode = { id: string, name: string, generator: string }

export type PolyphonicNode = BaseNode & {
  polyphonic: true,
  audioNodes: AudioNode[]
}

export type MonophonicNode = BaseNode & {
  polyphonic: false,
  audioNode?: AudioNode
}

export type ModuleNode = PolyphonicNode | MonophonicNode