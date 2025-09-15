import { MonophonicNode, PolyphonicNode } from "@synple/core";
import { createFactory } from "../utils/factories";
import { v7 as uuid } from 'uuid'

export const PolyphonicNodeFactory = createFactory<PolyphonicNode>({
  id: () => uuid(),
  polyphonic: () => true,
  name: () => 'polynode',
  generator: () => 'generator',
  audioNodes: () => []
})

export const MonophonicNodeFactory = createFactory<MonophonicNode>({
  id: () => uuid(),
  polyphonic: () => false,
  name: () => 'mononode',
  generator: () => 'generator'
})